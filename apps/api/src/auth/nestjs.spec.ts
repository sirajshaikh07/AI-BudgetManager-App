import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';

describe('AuthService NestJS Minimal', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: getRepositoryToken(User), useValue: { findOne: jest.fn(), create: jest.fn(), save: jest.fn() } },
                { provide: JwtService, useValue: { sign: jest.fn().mockReturnValue('mock-token'), verify: jest.fn() } },
                { provide: ConfigService, useValue: { get: jest.fn().mockReturnValue('test-value') } },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
