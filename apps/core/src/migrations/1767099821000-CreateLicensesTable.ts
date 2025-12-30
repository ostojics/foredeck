import {MigrationInterface, QueryRunner, Table, TableIndex} from 'typeorm';

export class CreateLicensesTable1767099821000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'licenses',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
            default: 'gen_random_uuid()',
          },
          {
            name: 'license_key',
            type: 'text',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'expires_at',
            type: 'timestamptz',
            isNullable: false,
          },
          {
            name: 'metadata',
            type: 'jsonb',
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

    // Create index on license_key for fast lookups
    await queryRunner.createIndex(
      'licenses',
      new TableIndex({
        name: 'idx_licenses_license_key',
        columnNames: ['license_key'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('licenses', 'idx_licenses_license_key');
    await queryRunner.dropTable('licenses');
  }
}
