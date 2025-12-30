import {MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex} from 'typeorm';

export class CreateUserIdentitiesTable1767099824000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_identities',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
            default: 'gen_random_uuid()',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'provider',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'provider_id',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'password_hash',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            isNullable: false,
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Create foreign key to users
    await queryRunner.createForeignKey(
      'user_identities',
      new TableForeignKey({
        name: 'fk_user_identities_user_id',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Create composite unique constraint on (provider, provider_id)
    await queryRunner.createIndex(
      'user_identities',
      new TableIndex({
        name: 'idx_user_identities_provider_provider_id',
        columnNames: ['provider', 'provider_id'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('user_identities', 'idx_user_identities_provider_provider_id');
    await queryRunner.dropForeignKey('user_identities', 'fk_user_identities_user_id');
    await queryRunner.dropTable('user_identities');
  }
}
