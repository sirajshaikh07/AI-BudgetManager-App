import { Module, Global, Logger } from '@nestjs/common';
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
            useFactory: (config: ConfigService<AppConfig, true>): Redis | null => {
                const redisUrl = config.get('redis.url', { infer: true });
                const logger = new Logger('RedisModule');

                // If no REDIS_URL is set, skip connecting (development without Redis)
                if (!redisUrl) {
                    logger.warn('REDIS_URL not set — Redis is disabled. Set REDIS_URL to enable caching.');
                    return null;
                }

                const client = new Redis(redisUrl, {
                    maxRetriesPerRequest: 3,
                    lazyConnect: false,
                });

                client.on('error', (err: Error) => {
                    logger.error(`Connection error: ${err.message}`);
                });

                client.on('connect', () => {
                    logger.log('Connected successfully');
                });

                return client;
            },
        },
    ],
    exports: [REDIS_CLIENT],
})
export class RedisModule { }
