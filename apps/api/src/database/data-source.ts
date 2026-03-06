import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const isCompiled = __dirname.includes('dist');

export const AppDataSource = new DataSource({
    type: 'postgres',
    url: process.env['DATABASE_URL'],

    // Never auto-sync in any environment — use migrations
    synchronize: false,
    logging: process.env['NODE_ENV'] === 'development',

    // Supabase requires SSL connections
    ssl: {
        rejectUnauthorized: false,
    },

    entities: isCompiled
        ? [path.join(__dirname, '../**/*.entity.js')]
        : [path.join(__dirname, '../**/*.entity.ts')],

    migrations: isCompiled
        ? [path.join(__dirname, './migrations/*.js')]
        : [path.join(__dirname, './migrations/*.ts')],

    migrationsRun: false,

    // Connection pool settings
    extra: {
        max: 20,
    },
});
