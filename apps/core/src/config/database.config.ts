import {registerAs} from '@nestjs/config';
import {PostgresConnectionOptions} from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const DatabaseConfigName = 'database';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DatabaseConfig extends PostgresConnectionOptions {}

export function getConfig(): PostgresConnectionOptions {
  // Support both TypeScript (development) and JavaScript (production) migrations
  const isProd = process.env.NODE_ENV === 'production';
  const migrationsPath = isProd ? ['dist/migrations/**/*.js'] : ['src/migrations/**/*.ts'];

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
    migrations: migrationsPath,
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
