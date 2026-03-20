import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { CreateAccountDto, UpdateAccountDto } from './dto';

@Injectable()
export class AccountsService {
    private readonly logger = new Logger(AccountsService.name);

    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,
    ) { }

    async create(userId: string, dto: CreateAccountDto): Promise<Account> {
        const account = this.accountRepository.create({
            userId,
            name: dto.name,
            type: dto.type,
            currency: dto.currency ?? 'INR',
            initialBalance: String(dto.initialBalance ?? 0),
            currentBalance: String(dto.initialBalance ?? 0),
            bankName: dto.bankName ?? null,
            accountNumberLast4: dto.accountNumberLast4 ?? null,
            color: dto.color ?? '#4F46E5',
            icon: dto.icon ?? null,
        });

        const savedAccount = await this.accountRepository.save(account);
        this.logger.log(`Account created: ${savedAccount.id} for user: ${userId}`);
        return savedAccount;
    }

    async findAll(userId: string): Promise<Account[]> {
        return this.accountRepository.find({
            where: { userId, isActive: true },
            order: { createdAt: 'ASC' },
        });
    }

    async findOne(userId: string, accountId: string): Promise<Account> {
        const account = await this.accountRepository.findOne({
            where: { id: accountId },
        });

        if (!account) {
            throw new NotFoundException('Account not found');
        }

        if (account.userId !== userId) {
            throw new ForbiddenException('You do not have access to this account');
        }

        return account;
    }

    async update(userId: string, accountId: string, dto: UpdateAccountDto): Promise<Account> {
        const account = await this.findOne(userId, accountId);

        if (dto.name !== undefined) account.name = dto.name;
        if (dto.type !== undefined) account.type = dto.type;
        if (dto.currency !== undefined) account.currency = dto.currency;
        if (dto.bankName !== undefined) account.bankName = dto.bankName;
        if (dto.accountNumberLast4 !== undefined) account.accountNumberLast4 = dto.accountNumberLast4;
        if (dto.color !== undefined) account.color = dto.color;
        if (dto.icon !== undefined) account.icon = dto.icon;

        const updated = await this.accountRepository.save(account);
        this.logger.log(`Account updated: ${accountId}`);
        return updated;
    }

    async remove(userId: string, accountId: string): Promise<void> {
        const account = await this.findOne(userId, accountId);
        account.isActive = false;
        await this.accountRepository.save(account);
        this.logger.log(`Account soft-deleted: ${accountId}`);
    }

    /**
     * Update account balance after a transaction.
     * Called internally by TransactionsService.
     */
    async updateBalance(accountId: string, delta: number): Promise<void> {
        await this.accountRepository
            .createQueryBuilder()
            .update(Account)
            .set({
                currentBalance: () => `"current_balance" + ${delta}`,
            })
            .where('id = :id', { id: accountId })
            .execute();
    }

    /**
     * Get the total balance across all active accounts for a user.
     */
    async getTotalBalance(userId: string): Promise<{ totalBalance: string; currency: string; accountsCount: number }> {
        const accounts = await this.findAll(userId);
        const total = accounts.reduce((sum, acc) => sum + parseFloat(acc.currentBalance), 0);
        return {
            totalBalance: total.toFixed(2),
            currency: accounts[0]?.currency ?? 'INR',
            accountsCount: accounts.length,
        };
    }
}
