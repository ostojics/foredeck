import {MigrationInterface, QueryRunner} from 'typeorm';

/**
 * Migration: Create Users Table
 *
 * Creates the users table which stores user profile information.
 * Each user belongs to a tenant (many-to-one relationship).
 * Email must be unique within a tenant.
 *
 * Schema Reference: docs/general/initial-schemas.md
 * Related Story: _bmad-output/planning-artifacts/onboarding-epic-and-stories.md (Story 1)
 */
export class CreateUsersTable1735644200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" UUID NOT NULL,
        "email" TEXT NOT NULL,
        "full_name" TEXT NOT NULL,
        CONSTRAINT "fk_users_tenant_id" 
          FOREIGN KEY ("tenant_id") 
          REFERENCES "tenants" ("id") 
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "uq_users_email_per_tenant" 
          UNIQUE ("tenant_id", "email")
      );
    `);

    // Create index on tenant_id for multi-tenant queries
    await queryRunner.query(`
      CREATE INDEX "idx_users_tenant_id" ON "users" ("tenant_id");
    `);

    // Create index on email for lookups within tenant
    await queryRunner.query(`
      CREATE INDEX "idx_users_email" ON "users" ("email");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_email";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_tenant_id";`);

    // Drop table (foreign key constraint will be dropped automatically)
    await queryRunner.query(`DROP TABLE IF EXISTS "users";`);
  }
}
