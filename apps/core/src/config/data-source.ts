import {DataSource} from 'typeorm';
import {getConfig} from './database.config';

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
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
});
