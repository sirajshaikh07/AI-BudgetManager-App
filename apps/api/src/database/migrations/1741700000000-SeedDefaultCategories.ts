import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDefaultCategories1741700000000 implements MigrationInterface {
    name = 'SeedDefaultCategories1741700000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO categories (id, user_id, name, type, parent_id, icon, color, is_default, created_at)
            VALUES
                (gen_random_uuid(), NULL, 'Food & Dining',        'EXPENSE',  NULL, 'fork-knife',     '#EF4444', true, NOW()),
                (gen_random_uuid(), NULL, 'Housing & Rent',       'EXPENSE',  NULL, 'home',            '#8B5CF6', true, NOW()),
                (gen_random_uuid(), NULL, 'Transport',            'EXPENSE',  NULL, 'car',             '#3B82F6', true, NOW()),
                (gen_random_uuid(), NULL, 'Health & Medical',     'EXPENSE',  NULL, 'heart-pulse',     '#10B981', true, NOW()),
                (gen_random_uuid(), NULL, 'Entertainment',        'EXPENSE',  NULL, 'tv',              '#F59E0B', true, NOW()),
                (gen_random_uuid(), NULL, 'Shopping',             'EXPENSE',  NULL, 'shopping-bag',    '#EC4899', true, NOW()),
                (gen_random_uuid(), NULL, 'Investment',           'EXPENSE',  NULL, 'trending-up',     '#06B6D4', true, NOW()),
                (gen_random_uuid(), NULL, 'Bills & Utilities',    'EXPENSE',  NULL, 'zap',             '#6B7280', true, NOW()),
                (gen_random_uuid(), NULL, 'Education',            'EXPENSE',  NULL, 'book-open',       '#7C3AED', true, NOW()),
                (gen_random_uuid(), NULL, 'Personal Care',        'EXPENSE',  NULL, 'user',            '#DB2777', true, NOW()),
                (gen_random_uuid(), NULL, 'Salary',               'INCOME',   NULL, 'dollar-sign',     '#22C55E', true, NOW()),
                (gen_random_uuid(), NULL, 'Freelance',            'INCOME',   NULL, 'laptop',          '#16A34A', true, NOW()),
                (gen_random_uuid(), NULL, 'Investment Returns',   'INCOME',   NULL, 'bar-chart-2',     '#15803D', true, NOW()),
                (gen_random_uuid(), NULL, 'Transfer',             'TRANSFER', NULL, 'arrow-left-right','#64748B', true, NOW())
            ON CONFLICT DO NOTHING;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM categories
            WHERE is_default = true AND user_id IS NULL;
        `);
    }
}
