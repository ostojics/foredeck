# Core Database Schema

## 1. Licenses (The Access Root)

| Column        | Type        | Description                               |
| :------------ | :---------- | :---------------------------------------- |
| `id`          | UUID        | Primary Key                               |
| `license_key` | TEXT        | Unique secure string used in setup URL    |
| `expires_at`  | TIMESTAMPTZ | Checked by middleware for app access      |
| `metadata`    | JSONB       | Raw provider data (e.g., gumroad_sale_id) |
| `created_at`  | TIMESTAMPTZ | Default: now()                            |

## 2. Tenants (The Company)

| Column       | Type | Description                            |
| :----------- | :--- | :------------------------------------- |
| `id`         | UUID | Primary Key                            |
| `license_id` | UUID | Unique Foreign Key to `licenses` (1:1) |
| `name`       | TEXT | Company name                           |
| `slug`       | TEXT | URL identifier (e.g., acme-corp)       |

## 3. Users (The Profile)

| Column      | Type | Description                          |
| :---------- | :--- | :----------------------------------- |
| `id`        | UUID | Primary Key                          |
| `tenant_id` | UUID | Foreign Key to `tenants`             |
| `email`     | TEXT | Profile email (unique within tenant) |
| `full_name` | TEXT | Display name                         |

## 4. User Identities (The Credential)

| Column          | Type | Description                      |
| :-------------- | :--- | :------------------------------- |
| `id`            | UUID | Primary Key                      |
| `user_id`       | UUID | Unique Foreign Key to `users`    |
| `provider`      | TEXT | 'local' or 'google'              |
| `provider_id`   | TEXT | **NOT NULL** (Unique lookup key) |
| `password_hash` | TEXT | Nullable (Used for 'local' only) |

_Constraint: UNIQUE(provider, provider_id)_

---

## Identity Resolution Logic

The `provider_id` field is the unique "username" provided by the auth source. It must be populated as follows to ensure the `NOT NULL` constraint is met:

1. **Local (Email/Password)**:
   - `provider`: 'local'
   - `provider_id`: The user's **email address**.
   - `password_hash`: The hashed password string.
2. **Google (OAuth2)**:
   - `provider`: 'google'
   - `provider_id`: The **Google Subject ID** (`sub`). This is a permanent numeric string that stays the same even if the user changes their email address.
   - `password_hash`: `NULL`.

## The "License Guard" Check

The system validates the license status before allowing any data access:

```sql
SELECT l.expires_at
FROM licenses l
JOIN tenants t ON t.license_id = l.id
WHERE t.id = $current_tenant_id;
```

# Core Database Schema

## 1. Tables

- **Licenses**: Root of access (`license_key`, `expires_at`).
- **Tenants**: Linked 1:1 to a License. Holds company metadata.
- **Users**: Profile data linked to a Tenant.
- **User Identities**: Login credentials (Email/Pass or Google).

## 2. Multi-Tenant Utility

To ensure data isolation, all TypeORM queries must be initialized with this helper:

```typescript
export function createTenantBuilder<T>(repo: Repository<T>, tenantId: string, alias: string) {
  if (!tenantId) {
    throw new Error('CRITICAL: Aattempted query without tenantId');
  }

  return repo.createQueryBuilder(alias).where(`${alias}.tenant_id = :tenantId`, {tenantId});
}
```
