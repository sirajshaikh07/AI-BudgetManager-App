import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig } from '../config/configuration';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService<AppConfig, true>) => ({
                type: 'postgres' as const,
                url: config.get('database.url', { infer: true }),
                autoLoadEntities: true,
                synchronize: false,
                logging: process.env['NODE_ENV'] === 'development',
                extra: {
                    max: 20,
                },
            }),
        }),
    ],
})
export class DatabaseModule { }
