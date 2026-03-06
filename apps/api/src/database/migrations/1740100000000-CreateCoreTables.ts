import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * CreateAccountsTable — accounts, categories, transactions tables.
 * Derived from docs/BudgetPro_ProductionDoc.docx Section 3.2.
 */
export class CreateCoreTables1740100000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // ── Enum types ──────────────────────────────────────────────────────
        await queryRunner.query(`
            CREATE TYPE "account_type_enum" AS ENUM ('BANK', 'CASH', 'CREDIT_CARD', 'WALLET', 'INVESTMENT')
        `);

        await queryRunner.query(`
            CREATE TYPE "category_type_enum" AS ENUM ('INCOME', 'EXPENSE', 'TRANSFER')
        `);

        await queryRunner.query(`
            CREATE TYPE "transaction_type_enum" AS ENUM ('INCOME', 'EXPENSE', 'TRANSFER')
        `);

        // ── accounts table ──────────────────────────────────────────────────
        await queryRunner.query(`
            CREATE TABLE "accounts" (
                "id"                    UUID            NOT NULL DEFAULT gen_random_uuid(),
                "user_id"               UUID            NOT NULL,
                "name"                  VARCHAR(100)    NOT NULL,
                "type"                  account_type_enum NOT NULL DEFAULT 'CASH',
                "currency"              VARCHAR(3)      NOT NULL DEFAULT 'INR',
                "initial_balance"       DECIMAL(15,2)   NOT NULL DEFAULT 0,
                "current_balance"       DECIMAL(15,2)   NOT NULL DEFAULT 0,
                "bank_name"             VARCHAR(100)    DEFAULT NULL,
                "account_number_last4"  CHAR(4)         DEFAULT NULL,
                "color"                 VARCHAR(7)      NOT NULL DEFAULT '#4F46E5',
                "icon"                  VARCHAR(50)     DEFAULT NULL,
                "is_active"             BOOLEAN         NOT NULL DEFAULT true,
                "created_at"            TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
                "updated_at"            TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
                CONSTRAINT "PK_accounts_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_accounts_user" FOREIGN KEY ("user_id")
                    REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);

        await queryRunner.query(`CREATE INDEX "IDX_accounts_user_id" ON "accounts" ("user_id")`);

        // ── categories table ────────────────────────────────────────────────
        await queryRunner.query(`
            CREATE TABLE "categories" (
                "id"            UUID            NOT NULL DEFAULT gen_random_uuid(),
                "user_id"       UUID            DEFAULT NULL,
                "name"          VARCHAR(100)    NOT NULL,
                "type"          category_type_enum NOT NULL,
                "parent_id"     UUID            DEFAULT NULL,
                "icon"          VARCHAR(50)     NOT NULL DEFAULT 'tag',
                "color"         VARCHAR(7)      NOT NULL DEFAULT '#6B7280',
                "is_default"    BOOLEAN         NOT NULL DEFAULT false,
                "created_at"    TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
                CONSTRAINT "PK_categories_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_categories_user" FOREIGN KEY ("user_id")
                    REFERENCES "users"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_categories_parent" FOREIGN KEY ("parent_id")
                    REFERENCES "categories"("id") ON DELETE SET NULL
            )
        `);

        await queryRunner.query(`CREATE INDEX "IDX_categories_user_id" ON "categories" ("user_id")`);

        // ── transactions table ──────────────────────────────────────────────
        await queryRunner.query(`
            CREATE TABLE "transactions" (
                "id"                    UUID            NOT NULL DEFAULT gen_random_uuid(),
                "user_id"               UUID            NOT NULL,
                "account_id"            UUID            NOT NULL,
                "to_account_id"         UUID            DEFAULT NULL,
                "category_id"           UUID            NOT NULL,
                "type"                  transaction_type_enum NOT NULL,
                "amount"                DECIMAL(15,2)   NOT NULL CHECK ("amount" > 0),
                "currency"              VARCHAR(3)      NOT NULL DEFAULT 'INR',
                "transaction_date"      TIMESTAMPTZ     NOT NULL,
                "description"           VARCHAR(255)    DEFAULT NULL,
                "merchant"              VARCHAR(100)    DEFAULT NULL,
                "is_recurring_instance" BOOLEAN         NOT NULL DEFAULT false,
                "recurring_rule_id"     UUID            DEFAULT NULL,
                "tags"                  TEXT[]          NOT NULL DEFAULT '{}',
                "created_at"            TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
                "updated_at"            TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
                "deleted_at"            TIMESTAMPTZ     DEFAULT NULL,
                CONSTRAINT "PK_transactions_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_transactions_user" FOREIGN KEY ("user_id")
                    REFERENCES "users"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_transactions_account" FOREIGN KEY ("account_id")
                    REFERENCES "accounts"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_transactions_to_account" FOREIGN KEY ("to_account_id")
                    REFERENCES "accounts"("id") ON DELETE SET NULL,
                CONSTRAINT "FK_transactions_category" FOREIGN KEY ("category_id")
                    REFERENCES "categories"("id")
            )
        `);

        await queryRunner.query(`CREATE INDEX "IDX_transactions_user_id" ON "transactions" ("user_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_transactions_account_id" ON "transactions" ("account_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_transactions_date" ON "transactions" ("transaction_date")`);
        await queryRunner.query(`CREATE INDEX "IDX_transactions_deleted" ON "transactions" ("deleted_at") WHERE "deleted_at" IS NULL`);

        // ── Seed 14 default categories from Production Doc Section 11.2 ───
        await queryRunner.query(`
            INSERT INTO "categories" ("name", "type", "icon", "color", "is_default") VALUES
            ('Food & Dining',       'EXPENSE',  'utensils',       '#EF4444', true),
            ('Housing & Rent',      'EXPENSE',  'home',           '#8B5CF6', true),
            ('Transport',           'EXPENSE',  'car',            '#3B82F6', true),
            ('Health & Medical',    'EXPENSE',  'heart-pulse',    '#EC4899', true),
            ('Entertainment',       'EXPENSE',  'film',           '#F59E0B', true),
            ('Shopping',            'EXPENSE',  'shopping-bag',   '#10B981', true),
            ('Investment',          'EXPENSE',  'trending-up',    '#6366F1', true),
            ('Bills & Utilities',   'EXPENSE',  'zap',            '#F97316', true),
            ('Education',           'EXPENSE',  'book-open',      '#14B8A6', true),
            ('Personal Care',       'EXPENSE',  'smile',          '#D946EF', true),
            ('Salary',              'INCOME',   'briefcase',      '#22C55E', true),
            ('Freelance',           'INCOME',   'laptop',         '#06B6D4', true),
            ('Investment Returns',  'INCOME',   'bar-chart-2',    '#8B5CF6', true),
            ('Transfer',            'TRANSFER', 'arrow-left-right','#6B7280', true)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "transactions"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "categories"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "accounts"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "transaction_type_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "category_type_enum"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "account_type_enum"`);
    }
}
