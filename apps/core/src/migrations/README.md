# Database Migrations

This directory contains TypeORM migration files for the core database schema.

## Available Migrations

1. **CreateLicensesTable** - Creates the `licenses` table (no dependencies)
2. **CreateTenantsTable** - Creates the `tenants` table (depends on licenses)
3. **CreateUsersTable** - Creates the `users` table (depends on tenants)
4. **CreateUserIdentitiesTable** - Creates the `user_identities` table (depends on users)

## Running Migrations

### Run all pending migrations

```bash
npm run migration:run
```

### Revert the last migration

```bash
npm run migration:revert
```

### Show migration status

```bash
npm run migration:show
```

## Database Schema

### Licenses
Root of access control with license keys and expiration dates.

### Tenants
Company/organization data linked 1:1 to a license.

### Users
User profile data linked to a tenant for multi-tenant isolation.

### User Identities
Authentication credentials (local email/password or OAuth providers like Google).

## Key Constraints

- **1:1 Relationships**: 
  - `tenants.license_id` → `licenses.id`
  - `user_identities.user_id` → `users.id`
  
- **Multi-tenant Isolation**: 
  - Email is unique per tenant: `UNIQUE(tenant_id, email)`
  
- **Authentication Uniqueness**: 
  - Provider IDs are unique per provider: `UNIQUE(provider, provider_id)`

## Environment Setup

Ensure your `.env` file has the following database configuration:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=foredeck_dev
DB_USE_SSL=false
```

## Notes

- Migrations run automatically on application start when `migrationsRun: true` is set in `database.config.ts`
- All tables use UUID primary keys with `gen_random_uuid()` default
- All timestamps use PostgreSQL's `TIMESTAMPTZ` type with UTC timezone
- Foreign keys use CASCADE on delete and update for data consistency
