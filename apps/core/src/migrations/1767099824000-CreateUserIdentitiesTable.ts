import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateUserIdentitiesTable1767099824000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE user_identities (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL UNIQUE,
        provider text NOT NULL,
        provider_id text NOT NULL,
        password_hash text NULL,
        created_at timestamp with time zone NOT NULL DEFAULT now(),
        CONSTRAINT fk_user_identities_user_id FOREIGN KEY (user_id) 
          REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT idx_user_identities_provider_provider_id UNIQUE (provider, provider_id)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE user_identities;`);
  }
}
