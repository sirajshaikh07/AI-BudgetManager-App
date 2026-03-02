import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { AppConfig } from '../config/configuration';
import { REDIS_CLIENT } from './redis.constants';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: REDIS_CLIENT,
            inject: [ConfigService],
            useFactory: (config: ConfigService<AppConfig, true>): Redis => {
                const redisUrl = config.get('redis.url', { infer: true });
                const client = new Redis(redisUrl, {
                    maxRetriesPerRequest: 3,
                    lazyConnect: false,
                });

                client.on('error', (err: Error) => {
                    console.error('[Redis] Connection error:', err.message);
                });

                client.on('connect', () => {
                    console.log('[Redis] Connected successfully');
                });

                return client;
            },
        },
    ],
    exports: [REDIS_CLIENT],
})
export class RedisModule { }
