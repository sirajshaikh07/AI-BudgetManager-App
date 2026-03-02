import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig } from '../config/configuration';

@Module({
    imports: [
        NestJwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService<AppConfig, true>) => ({
                privateKey: config.get('jwt.privateKey', { infer: true }),
                publicKey: config.get('jwt.publicKey', { infer: true }),
                signOptions: {
                    algorithm: 'RS256',
                    expiresIn: config.get('jwt.accessExpiresIn', { infer: true }),
                    issuer: 'budget-pro-api',
                    audience: 'budget-pro-mobile',
                },
                verifyOptions: {
                    algorithms: ['RS256'],
                    issuer: 'budget-pro-api',
                    audience: 'budget-pro-mobile',
                },
            }),
        }),
    ],
    exports: [NestJwtModule],
})
export class JwtConfigModule { }
