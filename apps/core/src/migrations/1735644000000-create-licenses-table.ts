import {MigrationInterface, QueryRunner} from 'typeorm';

/**
 * Migration: Create Licenses Table
 *
 * Creates the licenses table which serves as the root of access control.
 * Each license represents a purchased access key that can be used to set up a tenant.
 *
 * Schema Reference: docs/general/initial-schemas.md
 * Related Story: _bmad-output/planning-artifacts/onboarding-epic-and-stories.md (Story 1)
 */
export class CreateLicensesTable1735644000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable pgcrypto extension for UUID generation
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

    // Create licenses table
    await queryRunner.query(`
      CREATE TABLE "licenses" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "license_key" TEXT NOT NULL UNIQUE,
        "expires_at" TIMESTAMPTZ NOT NULL,
        "metadata" JSONB DEFAULT '{}'::jsonb,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Create index on license_key for faster lookups
    await queryRunner.query(`
      CREATE INDEX "idx_licenses_license_key" ON "licenses" ("license_key");
    `);

    // Create index on expires_at for license expiration checks
    await queryRunner.query(`
      CREATE INDEX "idx_licenses_expires_at" ON "licenses" ("expires_at");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_licenses_expires_at";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_licenses_license_key";`);

    // Drop table
    await queryRunner.query(`DROP TABLE IF EXISTS "licenses";`);
  }
}
