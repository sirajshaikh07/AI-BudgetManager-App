import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { AccountsService } from '../accounts/accounts.service';
import { Account } from '../accounts/entities/account.entity';

describe('TransactionsService', () => {
    let service: TransactionsService;

    const mockTransaction = {
        id: 'txn-uuid-1',
        userId: 'user-uuid-1',
        accountId: 'acct-uuid-1',
        toAccountId: null,
        categoryId: 'cat-uuid-food',
        type: TransactionType.EXPENSE,
        amount: '480.00',
        currency: 'INR',
        transactionDate: new Date('2026-03-10T13:30:00Z'),
        description: 'Zomato',
        merchant: 'Zomato',
        tags: [],
        isRecurringInstance: false,
        recurringRuleId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
    } as unknown as Transaction;

    const mockTransactionRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        createQueryBuilder: jest.fn(),
        softDelete: jest.fn(),
    };

    // Need this for AccountsService to be resolvable within the NestJS DI container
    const mockAccountRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        createQueryBuilder: jest.fn(),
    };

    const mockAccountsService = {
        findOne: jest.fn(),
        updateBalance: jest.fn().mockResolvedValue(undefined),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        getTotalBalance: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TransactionsService,
                AccountsService,
                { provide: getRepositoryToken(Transaction), useValue: mockTransactionRepository },
                { provide: getRepositoryToken(Account), useValue: mockAccountRepository },
            ],
        })
            .overrideProvider(AccountsService)
            .useValue(mockAccountsService)
            .compile();

        service = module.get<TransactionsService>(TransactionsService);
        jest.clearAllMocks();
    });

    describe('create', () => {
        const baseDto = {
            accountId: 'acct-uuid-1',
            categoryId: 'cat-uuid-food',
            type: TransactionType.EXPENSE,
            amount: 480,
            transactionDate: '2026-03-10T13:30:00.000Z',
        };

        it('TC-TXN-001: should create expense transaction and decrease balance', async () => {
            mockAccountsService.findOne.mockResolvedValue({ id: 'acct-uuid-1', userId: 'user-uuid-1' });
            mockTransactionRepository.create.mockReturnValue(mockTransaction);
            mockTransactionRepository.save.mockResolvedValue(mockTransaction);

            const result = await service.create('user-uuid-1', baseDto);

            expect(result).toEqual(mockTransaction);
            expect(mockAccountsService.updateBalance).toHaveBeenCalledWith('acct-uuid-1', -480);
        });

        it('TC-TXN-002: should create income transaction and increase balance', async () => {
            const incomeDto = { ...baseDto, type: TransactionType.INCOME, amount: 62000 };
            const incomeTxn = { ...mockTransaction, type: TransactionType.INCOME, amount: '62000.00' };

            mockAccountsService.findOne.mockResolvedValue({ id: 'acct-uuid-1' });
            mockTransactionRepository.create.mockReturnValue(incomeTxn);
            mockTransactionRepository.save.mockResolvedValue(incomeTxn);

            await service.create('user-uuid-1', incomeDto);

            expect(mockAccountsService.updateBalance).toHaveBeenCalledWith('acct-uuid-1', 62000);
        });

        it('TC-TXN-003: should create transfer and update both account balances', async () => {
            const transferDto = {
                ...baseDto,
                type: TransactionType.TRANSFER,
                amount: 5000,
                toAccountId: 'acct-uuid-2',
            };
            const transferTxn = { ...mockTransaction, type: TransactionType.TRANSFER, toAccountId: 'acct-uuid-2' } as unknown as Transaction;

            mockAccountsService.findOne.mockResolvedValue({ id: 'acct-uuid-1' });
            mockTransactionRepository.create.mockReturnValue(transferTxn);
            mockTransactionRepository.save.mockResolvedValue(transferTxn);

            await service.create('user-uuid-1', transferDto);

            expect(mockAccountsService.updateBalance).toHaveBeenCalledWith('acct-uuid-1', -5000);
            expect(mockAccountsService.updateBalance).toHaveBeenCalledWith('acct-uuid-2', 5000);
        });

        it('TC-TXN-004: should throw BadRequestException for transfer without toAccountId', async () => {
            const transferDto = { ...baseDto, type: TransactionType.TRANSFER, amount: 5000 };
            mockAccountsService.findOne.mockResolvedValue({ id: 'acct-uuid-1' });

            await expect(service.create('user-uuid-1', transferDto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('findAll', () => {
        it('should return paginated transactions with default page and limit', async () => {
            const mockQb = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                addOrderBy: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getManyAndCount: jest.fn().mockResolvedValue([[mockTransaction], 1]),
            };
            mockTransactionRepository.createQueryBuilder.mockReturnValue(mockQb);

            const result = await service.findAll('user-uuid-1', {});

            expect(result.data).toHaveLength(1);
            expect(result.total).toBe(1);
            expect(result.page).toBe(1);
            expect(result.totalPages).toBe(1);
        });

        it('should apply search filter when search is provided', async () => {
            const mockQb = {
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                orderBy: jest.fn().mockReturnThis(),
                addOrderBy: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                take: jest.fn().mockReturnThis(),
                getManyAndCount: jest.fn().mockResolvedValue([[mockTransaction], 1]),
            };
            mockTransactionRepository.createQueryBuilder.mockReturnValue(mockQb);

            await service.findAll('user-uuid-1', { search: 'Zomato' });

            expect(mockQb.andWhere).toHaveBeenCalledWith(
                expect.stringContaining('ILIKE'),
                expect.objectContaining({ search: '%Zomato%' }),
            );
        });
    });

    describe('findOne', () => {
        it('should return transaction when it belongs to the user', async () => {
            mockTransactionRepository.findOne.mockResolvedValue(mockTransaction);

            const result = await service.findOne('user-uuid-1', 'txn-uuid-1');
            expect(result).toEqual(mockTransaction);
        });

        it('TC-TXN-006: should throw NotFoundException when transaction is not found', async () => {
            mockTransactionRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne('user-uuid-1', 'nonexistent')).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('TC-TXN-008: should soft delete and reverse balance', async () => {
            mockTransactionRepository.findOne.mockResolvedValue(mockTransaction);
            mockTransactionRepository.softDelete.mockResolvedValue({ affected: 1 });

            await service.remove('user-uuid-1', 'txn-uuid-1');

            // Balance should be reversed (EXPENSE → add back)
            expect(mockAccountsService.updateBalance).toHaveBeenCalledWith('acct-uuid-1', 480);
            expect(mockTransactionRepository.softDelete).toHaveBeenCalledWith('txn-uuid-1');
        });
    });
});
