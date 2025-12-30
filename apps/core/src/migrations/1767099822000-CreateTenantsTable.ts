import {MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex} from 'typeorm';

export class CreateTenantsTable1767099822000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tenants',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
            default: 'gen_random_uuid()',
          },
          {
            name: 'license_id',
            type: 'uuid',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'name',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'slug',
            type: 'text',
            isNullable: false,
            isUnique: true,
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

    // Create foreign key to licenses
    await queryRunner.createForeignKey(
      'tenants',
      new TableForeignKey({
        name: 'fk_tenants_license_id',
        columnNames: ['license_id'],
        referencedTableName: 'licenses',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Create index on slug for fast lookups
    await queryRunner.createIndex(
      'tenants',
      new TableIndex({
        name: 'idx_tenants_slug',
        columnNames: ['slug'],
      }),
    );

    // Create index on license_id for foreign key performance
    await queryRunner.createIndex(
      'tenants',
      new TableIndex({
        name: 'idx_tenants_license_id',
        columnNames: ['license_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('tenants', 'idx_tenants_license_id');
    await queryRunner.dropIndex('tenants', 'idx_tenants_slug');
    await queryRunner.dropForeignKey('tenants', 'fk_tenants_license_id');
    await queryRunner.dropTable('tenants');
  }
}
