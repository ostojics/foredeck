# NestJS Application Setup Guide

This document provides a comprehensive guide for setting up a NestJS application based on the patterns used in this codebase. It covers configuration management, logging, Swagger documentation, database setup with migrations, and essential application setup.

## Table of Contents

1. [Configuration Setup](#1-configuration-setup)
2. [Logger Setup with Pino](#2-logger-setup-with-pino)
3. [Swagger Setup](#3-swagger-setup)
4. [Package.json Scripts](#4-packagejson-scripts)
5. [Essential main.ts Setup](#5-essential-maints-setup)
6. [App Module Setup](#6-app-module-setup)

---

## 1. Configuration Setup

### Overview

The application uses `@nestjs/config` with a modular configuration approach. Each configuration domain (app, database, etc.) has its own config file that exports:

- A TypeScript interface defining the config structure
- A `getConfig()` function that reads from environment variables
- A `registerAs()` function that registers the config with NestJS
- A config name constant for type-safe access

### Configuration Structure

#### 1.1 Global Config Interface

Create a global config interface that aggregates all configuration domains:

```typescript
// src/config/config.interface.ts
import {AppConfig} from './app.config';
import {DatabaseConfig} from './database.config';
import {ThrottlerConfig} from './throttler.config';

export interface GlobalConfig {
  app: AppConfig;
  throttler: ThrottlerConfig;
  database: DatabaseConfig;
}
```

#### 1.2 App Configuration

```typescript
// src/config/app.config.ts
import {registerAs} from '@nestjs/config';

export interface AppConfig {
  url: string;
  port: number;
  jwtSecret: string;
  environment: string;
  webAppUrl: string;
  cookieDomain: string | null;
  logLevel: string;
}

export const AppConfigName = 'app';

export function getConfig(): AppConfig {
  const port = parseInt(process.env.PORT ?? '8080', 10);

  return {
    url: process.env.APP_URL || `http://localhost:${port}`,
    port,
    jwtSecret: process.env.JWT_SECRET || 'secret',
    environment: process.env.NODE_ENV || 'development',
    webAppUrl: process.env.WEB_APP_URL || '',
    cookieDomain: process.env.COOKIE_DOMAIN || null,
    logLevel: process.env.LOG_LEVEL || 'info',
  };
}

export const appConfig = registerAs<AppConfig>(AppConfigName, () => {
  return getConfig();
});
```

#### 1.3 Database Configuration with Migrations

```typescript
// src/config/database.config.ts
import {registerAs} from '@nestjs/config';
import {PostgresConnectionOptions} from 'typeorm/driver/postgres/PostgresConnectionOptions';

// Import migrations
import {InitPgcrypto1758655322744} from 'src/migrations/1758655322744-InitPgcrypto';

export const DatabaseConfigName = 'database';

export interface DatabaseConfig extends PostgresConnectionOptions {}

export function getConfig(): DatabaseConfig {
  return {
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: +(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE ?? 'myapp_dev',
    ssl: process.env.DB_USE_SSL === 'true',
    entities: [
      // Add your entities here as you create them
      // Example: User, Product, Order, etc.
    ],
    useUTC: true,
    migrations: [
      InitPgcrypto1758655322744,
      // Add additional migrations here as you create them
    ],
    migrationsRun: true, // Automatically run migrations on app start
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
```

#### 1.4 Migration Files

Migrations follow TypeORM's migration pattern. Here's an example migration that enables the `pgcrypto` extension:

```typescript
// src/migrations/1758655322744-InitPgcrypto.ts
import {MigrationInterface, QueryRunner} from 'typeorm';

export class InitPgcrypto1758655322744 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP EXTENSION IF EXISTS pgcrypto;`);
  }
}
```

**Key Points:**

- Migration class names must match the filename pattern: `{timestamp}-{Name}`
- Each migration implements `MigrationInterface` with `up()` and `down()` methods
- Migrations are automatically imported and registered in `database.config.ts`
- Set `migrationsRun: true` in database config to auto-run migrations on startup
- The `up()` method runs when applying the migration
- The `down()` method runs when reverting the migration

#### 1.5 Throttler Configuration

```typescript
// src/config/throttler.config.ts
import {ConfigService, registerAs} from '@nestjs/config';
import {GlobalConfig} from './config.interface';

export interface ThrottlerConfig {
  throttlerEnabled: boolean;
  ttl: number;
  limit: number;
}

export const ThrottlerConfigName = 'throttler';

export function getConfig(): ThrottlerConfig {
  const throttlerEnabled = process.env.THROTTLER_ENABLED ? process.env.THROTTLER_ENABLED === 'true' : false;

  return {
    throttlerEnabled,
    ttl: +process.env.THROTTLER_TTL! || 60000, // Time window in milliseconds
    limit: +process.env.THROTTLER_LIMIT! || 100, // Max requests per time window
  };
}

export function throttlerFactory() {
  return (configService: ConfigService<GlobalConfig>) => {
    const {throttlerEnabled, ttl, limit} = configService.get<ThrottlerConfig>(ThrottlerConfigName, {
      infer: true,
    }) as ThrottlerConfig;

    if (!throttlerEnabled) return {throttlers: []};

    return {
      throttlers: [
        {
          ttl,
          limit,
        },
      ],
    };
  };
}

export const throttlerConfig = registerAs<ThrottlerConfig>(ThrottlerConfigName, () => {
  return getConfig();
});
```

#### 1.6 ConfigModule Setup in AppModule

```typescript
import {ConfigModule} from '@nestjs/config';
import {appConfig} from './config/app.config';
import {databaseConfig} from './config/database.config';
import {throttlerConfig} from './config/throttler.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true, // Cache config values for performance
      load: [appConfig, databaseConfig, throttlerConfig],
    }),
    // ... other modules
  ],
})
export class AppModule {}
```

#### 1.7 Using Configuration in Services

```typescript
import {ConfigService} from '@nestjs/config';
import {GlobalConfig} from './config/config.interface';
import {AppConfig, AppConfigName} from './config/app.config';

@Injectable()
export class MyService {
  constructor(private readonly configService: ConfigService<GlobalConfig>) {}

  someMethod() {
    // Type-safe config access
    const appConfig = this.configService.getOrThrow<AppConfig>(AppConfigName);
    const port = appConfig.port;

    // Or access nested config directly
    const {port, url} = this.configService.getOrThrow<AppConfig>(AppConfigName);
  }
}
```

---

## 2. Logger Setup with Pino

### Overview

The application uses `pino-nestjs` for structured logging with pretty printing in development.

### 2.1 Installation

```bash
npm install pino-nestjs pino-http
npm install -D pino-pretty
```

### 2.2 LoggerModule Setup in AppModule

```typescript
import {LoggerModule} from 'pino-nestjs';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {GlobalConfig} from './config/config.interface';
import {AppConfig, AppConfigName} from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      /* ... */
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<GlobalConfig>) => {
        const config = configService.getOrThrow<AppConfig>(AppConfigName);

        return {
          pinoHttp: {
            level: config.logLevel, // e.g., 'info', 'debug', 'warn', 'error'
          },
        };
      },
    }),
    // ... other modules
  ],
})
export class AppModule {}
```

### 2.3 Using Logger in main.ts

```typescript
import {NestFactory} from '@nestjs/core';
import {Logger} from 'pino-nestjs';
import {AppModule} from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {bufferLogs: true});

  // Set Pino logger as the application logger
  app.useLogger(app.get(Logger));

  // ... rest of setup
}
```

### 2.4 Pretty Printing in Development

Add `pino-pretty` to your dev script in `package.json`:

```json
{
  "scripts": {
    "dev": "nest start --watch | pnpx pino-pretty"
  }
}
```

This pipes the output through `pino-pretty` for human-readable logs during development.

### 2.5 Using Logger in Services/Controllers

```typescript
import {Logger} from '@nestjs/common';

@Injectable()
export class MyService {
  private readonly logger = new Logger(MyService.name);

  someMethod() {
    this.logger.log('Info message');
    this.logger.warn('Warning message');
    this.logger.error('Error message', error.stack);
    this.logger.debug('Debug message');
  }
}
```

---

## 3. Swagger Setup

### Overview

Swagger/OpenAPI documentation is set up using `@nestjs/swagger` with a dedicated setup function.

### 3.1 Installation

```bash
npm install @nestjs/swagger
```

### 3.2 Swagger Setup Function

```typescript
// src/tools/swagger/swagger.setup.ts
import type {INestApplication} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {DocumentBuilder, OpenAPIObject, SwaggerModule} from '@nestjs/swagger';
import {AppConfigName} from 'src/config/app.config';
import {GlobalConfig} from '../../config/config.interface';

const SWAGGER_PATH = 'swagger';
const APP_NAME = 'My Application API';
const APP_VERSION = '1.0.0';
const APP_DESCRIPTION = 'API description';

function setupSwagger(app: INestApplication): OpenAPIObject {
  const configService = app.get(ConfigService<GlobalConfig>);

  const {url} = configService.getOrThrow(AppConfigName, {
    infer: true,
  });

  const config = new DocumentBuilder()
    .setTitle(APP_NAME)
    .setDescription(APP_DESCRIPTION)
    .setVersion(APP_VERSION)
    .addBearerAuth() // For JWT authentication
    .addApiKey({type: 'apiKey', name: 'Api-Key', in: 'header'}, 'Api-Key') // For API key auth
    .addServer(url)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_PATH, app, document, {
    customSiteTitle: APP_NAME,
    jsonDocumentUrl: 'swagger/json',
  });

  return document;
}

export default setupSwagger;
```

### 3.3 Using Swagger in main.ts

```typescript
import setupSwagger from './tools/swagger/swagger.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Setup Swagger
  setupSwagger(app);

  // ... rest of setup
}
```

### 3.4 Using Swagger Decorators in Controllers

```typescript
import {Controller, Get, Post, Body} from '@nestjs/common';
import {ApiTags, ApiOperation, ApiBody, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  @ApiOperation({summary: 'Get all users'})
  @ApiOkResponse({description: 'Returns all users'})
  @Get()
  findAll() {
    return [];
  }

  @ApiOperation({summary: 'Create a user'})
  @ApiBody({type: CreateUserDto})
  @ApiCreatedResponse({type: UserDto})
  @Post()
  create(@Body() dto: CreateUserDto) {
    return {};
  }
}
```

**Access Swagger UI:** `http://localhost:8080/swagger`

---

## 4. Package.json Scripts

### Essential Scripts (excluding testing)

```json
{
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "dev": "nest start --watch | pnpx pino-pretty",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "typeorm": "typeorm-ts-node-esm"
  }
}
```

**Script Descriptions:**

- `build`: Compiles TypeScript to JavaScript
- `format`: Formats code using Prettier
- `start`: Starts the application in production mode
- `dev`: Starts in watch mode with pretty-printed logs
- `start:debug`: Starts with Node.js debugger attached
- `start:prod`: Runs the compiled application from `dist/`
- `lint`: Lints and fixes code using ESLint
- `typeorm`: TypeORM CLI command (for manual migration commands if needed)

---

## 5. Essential main.ts Setup

### Complete main.ts Example

```typescript
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Logger} from 'pino-nestjs';
import {VERSION_NEUTRAL, VersioningType} from '@nestjs/common';
import {NestExpressApplication} from '@nestjs/platform-express';
import {ConfigService} from '@nestjs/config';
import {GlobalConfig} from './config/config.interface';
import {AppConfig, AppConfigName} from './config/app.config';
import helmet from 'helmet';
import setupSwagger from './tools/swagger/swagger.setup';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  // Create app with buffered logs (required for Pino)
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService<GlobalConfig>);
  const {webAppUrl} = configService.getOrThrow<AppConfig>(AppConfigName);

  // Set Pino logger
  app.useLogger(app.get(Logger));

  // Enable graceful shutdown hooks
  app.enableShutdownHooks();

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });

  // Configure body parser (increase limit for large payloads)
  app.useBodyParser('json', {limit: '10mb'});

  // Security middleware
  app.use(helmet());

  // Cookie parser middleware
  app.use(cookieParser());

  // Setup Swagger documentation
  setupSwagger(app);

  // Configure CORS
  app.enableCors({
    origin: webAppUrl,
    credentials: true,
  });

  // Start server
  const {port} = configService.getOrThrow<AppConfig>(AppConfigName);
  await app.listen(port);
}

void bootstrap();
```

**Key Setup Points:**

1. **Buffer Logs**: `bufferLogs: true` is required when using Pino logger
2. **Logger**: Set Pino logger using `app.useLogger(app.get(Logger))`
3. **Shutdown Hooks**: Enable for graceful shutdown handling
4. **Versioning**: URI-based API versioning (optional but recommended)
5. **Body Parser**: Configure JSON body size limits
6. **Security**: Use Helmet for security headers
7. **Cookies**: Cookie parser for cookie-based authentication
8. **Swagger**: Setup API documentation
9. **CORS**: Configure CORS with credentials support

---

## 6. App Module Setup

### Complete AppModule Example

```typescript
import {Module} from '@nestjs/common';
import {LoggerModule} from 'pino-nestjs';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ThrottlerModule} from '@nestjs/throttler';

import {GlobalConfig} from './config/config.interface';
import {AppConfig, appConfig, AppConfigName} from './config/app.config';
import {DatabaseConfig, databaseConfig, DatabaseConfigName} from './config/database.config';
import {throttlerConfig, throttlerFactory} from './config/throttler.config';

@Module({
  imports: [
    // 1. Configuration Module (must be first)
    ConfigModule.forRoot({
      cache: true,
      load: [appConfig, databaseConfig, throttlerConfig],
    }),

    // 2. Logger Module
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<GlobalConfig>) => {
        const config = configService.getOrThrow<AppConfig>(AppConfigName);
        return {
          pinoHttp: {
            level: config.logLevel,
          },
        };
      },
    }),

    // 3. Throttler Module (rate limiting)
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: throttlerFactory(),
    }),

    // 4. TypeORM Module (Database)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<GlobalConfig>) => {
        const config = configService.getOrThrow<DatabaseConfig>(DatabaseConfigName);
        return {
          ...config,
        };
      },
    }),

    // 5. Feature Modules
    // AuthModule,
    // UsersModule,
    // ... other feature modules
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**Module Import Order:**

1. **ConfigModule** - Must be imported first as other modules depend on it
2. **LoggerModule** - Early setup for logging
3. **ThrottlerModule** - Rate limiting
4. **TypeOrmModule** - Database connection
5. **Feature Modules** - Your application modules

**Key Patterns:**

- All async modules use `forRootAsync` with `ConfigModule` imported
- Config is accessed using `configService.getOrThrow<T>(ConfigName)`
- Type-safe config access using the `GlobalConfig` interface

---

## Summary

This setup provides:

- ✅ Type-safe configuration management with environment variables
- ✅ Structured logging with Pino and pretty printing in development
- ✅ Swagger/OpenAPI documentation
- ✅ Database setup with TypeORM and automatic migrations
- ✅ Essential security and middleware configuration
- ✅ Modular and maintainable architecture

Follow this guide to set up a new NestJS project with the same patterns and best practices used in this codebase.
