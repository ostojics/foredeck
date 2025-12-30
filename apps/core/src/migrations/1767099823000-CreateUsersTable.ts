import {MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex} from 'typeorm';

export class CreateUsersTable1767099823000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
            default: 'gen_random_uuid()',
          },
          {
            name: 'tenant_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'full_name',
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

    // Create foreign key to tenants
    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        name: 'fk_users_tenant_id',
        columnNames: ['tenant_id'],
        referencedTableName: 'tenants',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Create composite unique constraint on (tenant_id, email)
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'idx_users_tenant_id_email',
        columnNames: ['tenant_id', 'email'],
        isUnique: true,
      }),
    );

    // Create index on tenant_id for foreign key performance
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'idx_users_tenant_id',
        columnNames: ['tenant_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('users', 'idx_users_tenant_id');
    await queryRunner.dropIndex('users', 'idx_users_tenant_id_email');
    await queryRunner.dropForeignKey('users', 'fk_users_tenant_id');
    await queryRunner.dropTable('users');
  }
}
