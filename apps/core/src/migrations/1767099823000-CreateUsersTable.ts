import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateUsersTable1767099823000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id uuid NOT NULL,
        email text NOT NULL,
        full_name text NULL,
        created_at timestamp with time zone NOT NULL DEFAULT now(),
        CONSTRAINT fk_users_tenant_id FOREIGN KEY (tenant_id) 
          REFERENCES tenants(id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT idx_users_tenant_id_email UNIQUE (tenant_id, email)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE users;`);
  }
}
