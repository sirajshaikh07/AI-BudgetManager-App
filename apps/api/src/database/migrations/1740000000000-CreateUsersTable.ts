import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * CreateUsersTable — initial migration for the users table.
 * Derived from docs/BudgetPro_ProductionDoc.docx Section 3.2.
 *
 * Timestamp: 1740000000000 (fixed so it always sorts first)
 */
export class CreateUsersTable1740000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Enable uuid-ossp extension for gen_random_uuid()
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        await queryRunner.query(`
      CREATE TABLE "users" (
        "id"            UUID              NOT NULL DEFAULT gen_random_uuid(),
        "email"         VARCHAR(255)      NOT NULL,
        "phone"         VARCHAR(20)       DEFAULT NULL,
        "password_hash" VARCHAR(255)      DEFAULT NULL,
        "full_name"     VARCHAR(100)      NOT NULL,
        "country"       CHAR(2)           NOT NULL DEFAULT 'IN',
        "currency"      VARCHAR(3)        NOT NULL DEFAULT 'INR',
        "is_premium"    BOOLEAN           NOT NULL DEFAULT false,
        "avatar_url"    TEXT              DEFAULT NULL,
        "fcm_token"     TEXT              DEFAULT NULL,
        "created_at"    TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
        "updated_at"    TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
        "deleted_at"    TIMESTAMPTZ       DEFAULT NULL,
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);

        // Unique indexes (partial — ignore soft-deleted rows)
        await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_users_email"
        ON "users" ("email")
        WHERE "deleted_at" IS NULL
    `);

        await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_users_phone"
        ON "users" ("phone")
        WHERE "phone" IS NOT NULL AND "deleted_at" IS NULL
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    }
}
