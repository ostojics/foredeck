import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateLicensesTable1767099821000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE licenses (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        license_key text NOT NULL UNIQUE,
        expires_at timestamp with time zone NOT NULL,
        metadata jsonb NULL,
        created_at timestamp with time zone NOT NULL DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE licenses;`);
  }
}
