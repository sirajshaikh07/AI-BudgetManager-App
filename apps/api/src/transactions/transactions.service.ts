import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { CreateTransactionDto, UpdateTransactionDto, FilterTransactionsDto } from './dto';
import { AccountsService } from '../accounts/accounts.service';

interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

@Injectable()
export class TransactionsService {
    private readonly logger = new Logger(TransactionsService.name);

    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
        private readonly accountsService: AccountsService,
    ) { }

    async create(userId: string, dto: CreateTransactionDto): Promise<Transaction> {
        // Validate account ownership
        await this.accountsService.findOne(userId, dto.accountId);

        // Validate transfer has toAccountId
        if (dto.type === TransactionType.TRANSFER) {
            if (!dto.toAccountId) {
                throw new BadRequestException('Transfer requires a destination account (toAccountId)');
            }
            await this.accountsService.findOne(userId, dto.toAccountId);
        }

        const transaction = this.transactionRepository.create({
            userId,
            accountId: dto.accountId,
            toAccountId: dto.toAccountId ?? null,
            categoryId: dto.categoryId,
            type: dto.type,
            amount: String(dto.amount),
            currency: dto.currency ?? 'INR',
            transactionDate: new Date(dto.transactionDate),
            description: dto.description ?? null,
            merchant: dto.merchant ?? null,
            tags: dto.tags ?? [],
        });

        const saved = await this.transactionRepository.save(transaction);

        // Update account balance(s)
        await this.updateAccountBalances(dto.type, dto.accountId, dto.toAccountId, dto.amount);

        this.logger.log(`Transaction created: ${saved.id} (${dto.type} ${dto.amount})`);
        return saved;
    }

    async findAll(userId: string, filters: FilterTransactionsDto): Promise<PaginatedResult<Transaction>> {
        const page = filters.page ?? 1;
        const limit = Math.min(filters.limit ?? 20, 100);
        const skip = (page - 1) * limit;

        const qb: SelectQueryBuilder<Transaction> = this.transactionRepository
            .createQueryBuilder('txn')
            .leftJoinAndSelect('txn.category', 'category')
            .leftJoinAndSelect('txn.account', 'account')
            .where('txn.userId = :userId', { userId });

        if (filters.startDate) {
            qb.andWhere('txn.transactionDate >= :startDate', { startDate: filters.startDate });
        }
        if (filters.endDate) {
            qb.andWhere('txn.transactionDate <= :endDate', { endDate: filters.endDate });
        }
        if (filters.accountId) {
            qb.andWhere('txn.accountId = :accountId', { accountId: filters.accountId });
        }
        if (filters.categoryId) {
            qb.andWhere('txn.categoryId = :categoryId', { categoryId: filters.categoryId });
        }
        if (filters.type) {
            qb.andWhere('txn.type = :type', { type: filters.type });
        }
        if (filters.search) {
            qb.andWhere('(txn.description ILIKE :search OR txn.merchant ILIKE :search)', {
                search: `%${filters.search}%`,
            });
        }

        qb.orderBy('txn.transactionDate', 'DESC')
            .addOrderBy('txn.createdAt', 'DESC')
            .skip(skip)
            .take(limit);

        const [data, total] = await qb.getManyAndCount();

        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findOne(userId: string, transactionId: string): Promise<Transaction> {
        const transaction = await this.transactionRepository.findOne({
            where: { id: transactionId },
            relations: ['category', 'account'],
        });

        if (!transaction) {
            throw new NotFoundException('Transaction not found');
        }

        if (transaction.userId !== userId) {
            throw new ForbiddenException('You do not have access to this transaction');
        }

        return transaction;
    }

    async update(userId: string, transactionId: string, dto: UpdateTransactionDto): Promise<Transaction> {
        const transaction = await this.findOne(userId, transactionId);

        // If amount is changing, reverse old balance and apply new
        if (dto.amount !== undefined) {
            const oldAmount = parseFloat(transaction.amount);
            await this.reverseAccountBalances(
                transaction.type,
                transaction.accountId,
                transaction.toAccountId ?? undefined,
                oldAmount,
            );
            await this.updateAccountBalances(
                transaction.type,
                transaction.accountId,
                dto.toAccountId ?? transaction.toAccountId ?? undefined,
                dto.amount,
            );
        }

        if (dto.amount !== undefined) transaction.amount = String(dto.amount);
        if (dto.categoryId !== undefined) transaction.categoryId = dto.categoryId;
        if (dto.currency !== undefined) transaction.currency = dto.currency;
        if (dto.transactionDate !== undefined) transaction.transactionDate = new Date(dto.transactionDate);
        if (dto.description !== undefined) transaction.description = dto.description;
        if (dto.merchant !== undefined) transaction.merchant = dto.merchant;
        if (dto.toAccountId !== undefined) transaction.toAccountId = dto.toAccountId;
        if (dto.tags !== undefined) transaction.tags = dto.tags;

        const updated = await this.transactionRepository.save(transaction);
        this.logger.log(`Transaction updated: ${transactionId}`);
        return updated;
    }

    async remove(userId: string, transactionId: string): Promise<void> {
        const transaction = await this.findOne(userId, transactionId);

        // Reverse the balance effect
        const amount = parseFloat(transaction.amount);
        await this.reverseAccountBalances(
            transaction.type,
            transaction.accountId,
            transaction.toAccountId ?? undefined,
            amount,
        );

        // Soft delete
        await this.transactionRepository.softDelete(transactionId);
        this.logger.log(`Transaction soft-deleted: ${transactionId}, balance reversed`);
    }

    private async updateAccountBalances(
        type: TransactionType,
        accountId: string,
        toAccountId: string | undefined,
        amount: number,
    ): Promise<void> {
        switch (type) {
            case TransactionType.EXPENSE:
                await this.accountsService.updateBalance(accountId, -amount);
                break;
            case TransactionType.INCOME:
                await this.accountsService.updateBalance(accountId, amount);
                break;
            case TransactionType.TRANSFER:
                await this.accountsService.updateBalance(accountId, -amount);
                if (toAccountId) {
                    await this.accountsService.updateBalance(toAccountId, amount);
                }
                break;
        }
    }

    private async reverseAccountBalances(
        type: TransactionType,
        accountId: string,
        toAccountId: string | undefined,
        amount: number,
    ): Promise<void> {
        switch (type) {
            case TransactionType.EXPENSE:
                await this.accountsService.updateBalance(accountId, amount);
                break;
            case TransactionType.INCOME:
                await this.accountsService.updateBalance(accountId, -amount);
                break;
            case TransactionType.TRANSFER:
                await this.accountsService.updateBalance(accountId, amount);
                if (toAccountId) {
                    await this.accountsService.updateBalance(toAccountId, -amount);
                }
                break;
        }
    }
}
