import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
    let service: AuthService;
    const mockUserRepository = {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    };
    const mockJwtService = {
        sign: jest.fn().mockReturnValue('mock-access-token'),
        verify: jest.fn(),
    };
    const mockConfigService = {
        get: jest.fn().mockReturnValue('7d'),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: getRepositoryToken(User), useValue: mockUserRepository },
                { provide: JwtService, useValue: mockJwtService },
                { provide: ConfigService, useValue: mockConfigService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        jest.clearAllMocks();
    });

    describe('register', () => {
        // TC-AUTH-001: Register with valid email/password
        it('TC-AUTH-001: should register a new user and return tokens', async () => {
            const dto = { email: 'test@test.com', password: 'TestPass123', fullName: 'Test User' };
            const hashedPw = '$2b$12$hashedpassword';

            mockUserRepository.findOne.mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPw);
            mockUserRepository.create.mockReturnValue({
                id: 'uuid-1', email: dto.email, fullName: dto.fullName,
                passwordHash: hashedPw, phone: null, country: 'IN',
                currency: 'INR', isPremium: false, avatarUrl: null,
                fcmToken: null, createdAt: new Date(), updatedAt: new Date(),
                deletedAt: null,
            });
            mockUserRepository.save.mockImplementation((u: unknown) => Promise.resolve(u));

            const result = await service.register(dto);

            expect(result.user).toBeDefined();
            expect(result.tokens.accessToken).toBe('mock-access-token');
            expect(result.tokens.refreshToken).toBeDefined();
            expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 12);
            // TC-SEC-006: passwordHash must not be in response
            expect((result.user as Record<string, unknown>)['passwordHash']).toBeUndefined();
        });

        // TC-AUTH-002: Register with duplicate email
        it('TC-AUTH-002: should throw ConflictException for duplicate email', async () => {
            mockUserRepository.findOne.mockResolvedValue({ id: 'existing', email: 'test@test.com' });

            await expect(
                service.register({ email: 'test@test.com', password: 'TestPass123', fullName: 'Test' }),
            ).rejects.toThrow(ConflictException);
        });
    });

    describe('login', () => {
        // TC-AUTH-004: Login with correct credentials
        it('TC-AUTH-004: should return tokens on valid login', async () => {
            const user = {
                id: 'uuid-1', email: 'test@test.com', passwordHash: '$2b$12$hashed',
                fullName: 'Test User', phone: null, country: 'IN', currency: 'INR',
                isPremium: false, avatarUrl: null, fcmToken: null,
                createdAt: new Date(), updatedAt: new Date(), deletedAt: null,
            };
            mockUserRepository.findOne.mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const result = await service.login({ email: 'test@test.com', password: 'TestPass123' });

            expect(result.tokens.accessToken).toBe('mock-access-token');
            expect(result.user).toBeDefined();
        });

        // TC-AUTH-005: Login with wrong password
        it('TC-AUTH-005: should throw UnauthorizedException for wrong password', async () => {
            mockUserRepository.findOne.mockResolvedValue({
                id: 'uuid-1', email: 'test@test.com', passwordHash: '$2b$12$hashed',
            });
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(
                service.login({ email: 'test@test.com', password: 'WrongPass123' }),
            ).rejects.toThrow(UnauthorizedException);
        });

        // TC-AUTH: Login with non-existent email
        it('should throw UnauthorizedException for non-existent email', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);

            await expect(
                service.login({ email: 'noone@test.com', password: 'TestPass123' }),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('refreshToken', () => {
        // TC-AUTH-007: Refresh token expired/invalid
        it('TC-AUTH-007: should throw UnauthorizedException for invalid refresh token', async () => {
            await expect(
                service.refreshToken({ refreshToken: 'invalid-token' }),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('getProfile', () => {
        it('should return user without passwordHash', async () => {
            const user = {
                id: 'uuid-1', email: 'test@test.com', passwordHash: '$2b$12$hashed',
                fullName: 'Test', phone: null, country: 'IN', currency: 'INR',
                isPremium: false, avatarUrl: null, fcmToken: null,
                createdAt: new Date(), updatedAt: new Date(), deletedAt: null,
            };
            mockUserRepository.findOne.mockResolvedValue(user);

            const result = await service.getProfile('uuid-1');
            expect((result as Record<string, unknown>)['passwordHash']).toBeUndefined();
            expect(result.email).toBe('test@test.com');
        });

        it('should throw UnauthorizedException for non-existent user', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);

            await expect(service.getProfile('non-existent')).rejects.toThrow(UnauthorizedException);
        });
    });
});
