import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccountsService } from './accounts.service';
import { Account, AccountType } from './entities/account.entity';

describe('AccountsService', () => {
    let service: AccountsService;

    const mockAccount = {
        id: 'acct-uuid-1',
        userId: 'user-uuid-1',
        name: 'Cash Wallet',
        type: AccountType.CASH,
        currency: 'INR',
        initialBalance: '2000.00',
        currentBalance: '2000.00',
        bankName: null,
        accountNumberLast4: null,
        color: '#4F46E5',
        icon: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    } as Account;

    const mockAccountRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        createQueryBuilder: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AccountsService,
                { provide: getRepositoryToken(Account), useValue: mockAccountRepository },
            ],
        }).compile();

        service = module.get<AccountsService>(AccountsService);
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create and return a new account', async () => {
            mockAccountRepository.create.mockReturnValue(mockAccount);
            mockAccountRepository.save.mockResolvedValue(mockAccount);

            const dto = { name: 'Cash Wallet', type: AccountType.CASH, initialBalance: 2000 };
            const result = await service.create('user-uuid-1', dto);

            expect(result).toEqual(mockAccount);
            expect(mockAccountRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({ userId: 'user-uuid-1', name: 'Cash Wallet' }),
            );
            expect(mockAccountRepository.save).toHaveBeenCalled();
        });
    });

    describe('findAll', () => {
        it('should return all active accounts for a user', async () => {
            mockAccountRepository.find.mockResolvedValue([mockAccount]);

            const result = await service.findAll('user-uuid-1');

            expect(result).toEqual([mockAccount]);
            expect(mockAccountRepository.find).toHaveBeenCalledWith(
                expect.objectContaining({ where: { userId: 'user-uuid-1', isActive: true } }),
            );
        });
    });

    describe('findOne', () => {
        it('should return account when it belongs to the user', async () => {
            mockAccountRepository.findOne.mockResolvedValue(mockAccount);

            const result = await service.findOne('user-uuid-1', 'acct-uuid-1');
            expect(result).toEqual(mockAccount);
        });

        it('should throw NotFoundException when account does not exist', async () => {
            mockAccountRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne('user-uuid-1', 'nonexistent')).rejects.toThrow(NotFoundException);
        });

        it('should throw ForbiddenException when account belongs to another user', async () => {
            mockAccountRepository.findOne.mockResolvedValue({ ...mockAccount, userId: 'other-user' });

            await expect(service.findOne('user-uuid-1', 'acct-uuid-1')).rejects.toThrow(ForbiddenException);
        });
    });

    describe('update', () => {
        it('should update and return the account', async () => {
            const updatedAccount = { ...mockAccount, name: 'My Cash', color: '#DC2626' };
            mockAccountRepository.findOne.mockResolvedValue(mockAccount);
            mockAccountRepository.save.mockResolvedValue(updatedAccount);

            const result = await service.update('user-uuid-1', 'acct-uuid-1', { name: 'My Cash', color: '#DC2626' });

            expect(result.name).toBe('My Cash');
            expect(result.color).toBe('#DC2626');
        });
    });

    describe('remove', () => {
        it('should soft-delete account by setting isActive to false', async () => {
            mockAccountRepository.findOne.mockResolvedValue({ ...mockAccount });
            mockAccountRepository.save.mockResolvedValue({ ...mockAccount, isActive: false });

            await service.remove('user-uuid-1', 'acct-uuid-1');

            expect(mockAccountRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({ isActive: false }),
            );
        });
    });

    describe('getTotalBalance', () => {
        it('should return the sum of all account balances', async () => {
            const accounts = [
                { ...mockAccount, currentBalance: '2000.00', currency: 'INR' },
                { ...mockAccount, id: 'acct-2', currentBalance: '62340.00', currency: 'INR' },
            ] as Account[];
            mockAccountRepository.find.mockResolvedValue(accounts);

            const result = await service.getTotalBalance('user-uuid-1');

            expect(result.totalBalance).toBe('64340.00');
            expect(result.currency).toBe('INR');
            expect(result.accountsCount).toBe(2);
        });

        it('should return zero for user with no accounts', async () => {
            mockAccountRepository.find.mockResolvedValue([]);

            const result = await service.getTotalBalance('user-uuid-1');

            expect(result.totalBalance).toBe('0.00');
            expect(result.accountsCount).toBe(0);
        });
    });
});
