import {registerAs} from '@nestjs/config';
import {DataSource} from 'typeorm';
import {PostgresConnectionOptions} from 'typeorm/driver/postgres/PostgresConnectionOptions';
import {CreateLicensesTable1767099821000} from '../migrations/1767099821000-CreateLicensesTable';
import {CreateTenantsTable1767099822000} from '../migrations/1767099822000-CreateTenantsTable';
import {CreateUsersTable1767099823000} from '../migrations/1767099823000-CreateUsersTable';
import {CreateUserIdentitiesTable1767099824000} from '../migrations/1767099824000-CreateUserIdentitiesTable';

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
      CreateLicensesTable1767099821000,
      CreateTenantsTable1767099822000,
      CreateUsersTable1767099823000,
      CreateUserIdentitiesTable1767099824000,
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

// DataSource for TypeORM CLI
const config = getConfig();

export default new DataSource({
  type: 'postgres',
  host: config.host,
  port: config.port,
  username: config.username,
  password: config.password,
  database: config.database,
  ssl: config.ssl,
  entities: config.entities,
  migrations: config.migrations,
  migrationsTableName: 'migrations',
  synchronize: false,
});
