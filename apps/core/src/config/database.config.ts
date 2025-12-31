import {registerAs} from '@nestjs/config';
import {PostgresConnectionOptions} from 'typeorm/driver/postgres/PostgresConnectionOptions';
import {CreateLicensesTable1735644000000} from '../migrations/1735644000000-create-licenses-table';
import {CreateTenantsTable1735644100000} from '../migrations/1735644100000-create-tenants-table';
import {CreateUsersTable1735644200000} from '../migrations/1735644200000-create-users-table';
import {CreateUserIdentitiesTable1735644300000} from '../migrations/1735644300000-create-user-identities-table';

export const DatabaseConfigName = 'database';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DatabaseConfig extends PostgresConnectionOptions {}

export function getConfig(): PostgresConnectionOptions {
  return {
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: +(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? 'root',
    database: process.env.DB_DATABASE ?? 'myapp_dev',
    ssl: process.env.DB_USE_SSL === 'true',
    entities: [],
    useUTC: true,
    migrations: [
      CreateLicensesTable1735644000000,
      CreateTenantsTable1735644100000,
      CreateUsersTable1735644200000,
      CreateUserIdentitiesTable1735644300000,
    ],
    migrationsRun: true,
    extra: {
      max: process.env.DB_POOL_MAX ? parseInt(process.env.DB_POOL_MAX, 10) : 15,
      min: process.env.DB_POOL_MIN ? parseInt(process.env.DB_POOL_MIN, 10) : 2,
      idleTimeoutMillis: 20000,
      connectionTimeoutMillis: 10000,
    },
    logging: ['warn', 'error'],
  };
}

export const databaseConfig = registerAs<DatabaseConfig>(DatabaseConfigName, () => {
  return getConfig();
});
