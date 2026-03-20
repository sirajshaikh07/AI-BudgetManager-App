import {
    Injectable,
    ConflictException,
    UnauthorizedException,
    Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto, LoginDto, RefreshTokenDto, UpdateProfileDto } from './dto';
import { AppConfig } from '../config/configuration';
import { randomBytes } from 'crypto';

interface TokenPayload {
    sub: string;
    email: string;
    type: 'access' | 'refresh';
}

interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
}

interface AuthResponse {
    user: Omit<User, 'passwordHash'>;
    tokens: AuthTokens;
}

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    /** Map of refreshToken → userId (in production, use Redis or DB table) */
    private readonly refreshTokenStore = new Map<string, { userId: string; expiresAt: Date }>();

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService<AppConfig, true>,
    ) { }

    async register(dto: RegisterDto): Promise<AuthResponse> {
        // Check for duplicate email
        const existingUser = await this.userRepository.findOne({
            where: { email: dto.email.toLowerCase() },
        });

        if (existingUser) {
            throw new ConflictException('A user with this email already exists');
        }

        // Hash password with bcrypt cost factor 12
        const passwordHash = await bcrypt.hash(dto.password, 12);

        const user = this.userRepository.create({
            email: dto.email.toLowerCase(),
            passwordHash,
            fullName: dto.fullName,
            phone: dto.phone ?? null,
        });

        const savedUser = await this.userRepository.save(user);
        this.logger.log(`User registered: ${savedUser.id}`);

        const tokens = await this.generateTokens(savedUser);
        return {
            user: this.sanitizeUser(savedUser),
            tokens,
        };
    }

    async login(dto: LoginDto): Promise<AuthResponse> {
        const user = await this.userRepository.findOne({
            where: { email: dto.email.toLowerCase() },
        });

        if (!user || !user.passwordHash) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        this.logger.log(`User logged in: ${user.id}`);
        const tokens = await this.generateTokens(user);
        return {
            user: this.sanitizeUser(user),
            tokens,
        };
    }

    async refreshToken(dto: RefreshTokenDto): Promise<AuthTokens> {
        const stored = this.refreshTokenStore.get(dto.refreshToken);

        if (!stored || stored.expiresAt < new Date()) {
            this.refreshTokenStore.delete(dto.refreshToken);
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        const user = await this.userRepository.findOne({
            where: { id: stored.userId },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        // Rotate refresh token — invalidate old one, issue new pair
        this.refreshTokenStore.delete(dto.refreshToken);
        this.logger.log(`Token refreshed for user: ${user.id}`);

        return this.generateTokens(user);
    }

    async logout(refreshToken: string): Promise<void> {
        this.refreshTokenStore.delete(refreshToken);
        this.logger.log('Refresh token invalidated');
    }

    async getProfile(userId: string): Promise<Omit<User, 'passwordHash'>> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return this.sanitizeUser(user);
    }

    async updateProfile(userId: string, dto: UpdateProfileDto): Promise<Omit<User, 'passwordHash'>> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        if (dto.fullName !== undefined) user.fullName = dto.fullName;
        if (dto.phone !== undefined) user.phone = dto.phone;
        if (dto.currency !== undefined) user.currency = dto.currency;
        if (dto.country !== undefined) user.country = dto.country;
        if (dto.avatarUrl !== undefined) user.avatarUrl = dto.avatarUrl;

        const updated = await this.userRepository.save(user);
        this.logger.log(`Profile updated for user: ${userId}`);
        return this.sanitizeUser(updated);
    }

    async validateAccessToken(token: string): Promise<TokenPayload> {
        try {
            const payload = this.jwtService.verify<TokenPayload>(token, {
                publicKey: this.configService.get('jwt.publicKey', { infer: true }),
                algorithms: ['RS256'],
            });

            if (payload.type !== 'access') {
                throw new UnauthorizedException('Invalid token type');
            }

            return payload;
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }

    private async generateTokens(user: User): Promise<AuthTokens> {
        const accessPayload: TokenPayload = {
            sub: user.id,
            email: user.email,
            type: 'access',
        };

        const accessToken = this.jwtService.sign(accessPayload);

        // Generate opaque refresh token
        const refreshToken = randomBytes(64).toString('hex');
        const refreshExpiresIn = this.configService.get('jwt.refreshExpiresIn', { infer: true });
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

        this.refreshTokenStore.set(refreshToken, {
            userId: user.id,
            expiresAt,
        });

        return {
            accessToken,
            refreshToken,
            expiresIn: refreshExpiresIn,
        };
    }

    private sanitizeUser(user: User): Omit<User, 'passwordHash'> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...sanitized } = user;
        return sanitized as Omit<User, 'passwordHash'>;
    }
}
