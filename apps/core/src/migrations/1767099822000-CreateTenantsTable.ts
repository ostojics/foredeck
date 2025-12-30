import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateTenantsTable1767099822000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE tenants (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        license_id uuid NOT NULL UNIQUE,
        name text NOT NULL,
        slug text NOT NULL UNIQUE,
        created_at timestamp with time zone NOT NULL DEFAULT now(),
        CONSTRAINT fk_tenants_license_id FOREIGN KEY (license_id) 
          REFERENCES licenses(id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE tenants;`);
  }
}
