import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { envValidationSchema } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';
import { CategoriesModule } from './categories/categories.module';
import { TransactionsModule } from './transactions/transactions.module';
import { HealthController } from './health.controller';

@Module({
    imports: [
        // Config — global so all modules can inject ConfigService without re-importing
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            validationSchema: envValidationSchema,
            validationOptions: {
                allowUnknown: true,  // must be true — process.env contains Windows OS vars too
                abortEarly: false,   // report ALL missing app vars at once, not just the first
            },
        }),

        // Infrastructure
        DatabaseModule,
        RedisModule,

        // Phase 1 — Feature modules
        AuthModule,
        AccountsModule,
        CategoriesModule,
        TransactionsModule,
    ],
    controllers: [HealthController],
    providers: [],
})
export class AppModule { }

