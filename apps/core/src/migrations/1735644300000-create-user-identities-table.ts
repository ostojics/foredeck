import {MigrationInterface, QueryRunner} from 'typeorm';

/**
 * Migration: Create User Identities Table
 *
 * Creates the user_identities table which stores authentication credentials.
 * Each identity belongs to exactly one user (enforced by UNIQUE constraint on user_id).
 * Supports multiple authentication providers (local email/password, Google OAuth).
 *
 * Key Constraints:
 * - provider_id is NOT NULL (always required for identity resolution)
 * - UNIQUE constraint on (provider, provider_id) to prevent duplicate identities
 * - user_id is UNIQUE to enforce one identity per user (1:1 relationship)
 *
 * Provider Rules:
 * - 'local': provider_id = email, password_hash = hashed password
 * - 'google': provider_id = Google Subject ID (sub), password_hash = NULL
 *
 * Schema Reference: docs/general/initial-schemas.md
 * Related Story: _bmad-output/planning-artifacts/onboarding-epic-and-stories.md (Story 1)
 */
export class CreateUserIdentitiesTable1735644300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create user_identities table
    await queryRunner.query(`
      CREATE TABLE "user_identities" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" UUID NOT NULL UNIQUE,
        "provider" TEXT NOT NULL,
        "provider_id" TEXT NOT NULL,
        "password_hash" TEXT,
        CONSTRAINT "fk_user_identities_user_id" 
          FOREIGN KEY ("user_id") 
          REFERENCES "users" ("id") 
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT "uq_user_identities_provider_provider_id" 
          UNIQUE ("provider", "provider_id")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop table (foreign key constraint will be dropped automatically)
    await queryRunner.query(`DROP TABLE IF EXISTS "user_identities";`);
  }
}
