import {MigrationInterface, QueryRunner} from 'typeorm';

/**
 * Migration: Create Tenants Table
 *
 * Creates the tenants table which represents companies/organizations.
 * Each tenant has a 1:1 relationship with a license and contains company metadata.
 *
 * Schema Reference: docs/general/initial-schemas.md
 * Related Story: _bmad-output/planning-artifacts/onboarding-epic-and-stories.md (Story 1)
 */
export class CreateTenantsTable1735644100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create tenants table
    await queryRunner.query(`
      CREATE TABLE "tenants" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "license_id" UUID NOT NULL UNIQUE,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL UNIQUE,
        "url" TEXT,
        CONSTRAINT "fk_tenants_license_id" 
          FOREIGN KEY ("license_id") 
          REFERENCES "licenses" ("id") 
          ON DELETE CASCADE
          ON UPDATE CASCADE
      );
    `);

    // Create index on license_id for foreign key lookups
    await queryRunner.query(`
      CREATE INDEX "idx_tenants_license_id" ON "tenants" ("license_id");
    `);

    // Create index on slug for URL-based lookups
    await queryRunner.query(`
      CREATE INDEX "idx_tenants_slug" ON "tenants" ("slug");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_tenants_slug";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_tenants_license_id";`);

    // Drop table (foreign key constraint will be dropped automatically)
    await queryRunner.query(`DROP TABLE IF EXISTS "tenants";`);
  }
}
