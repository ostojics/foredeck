# Auth Strategy & Onboarding Flow

## 1. Purchase-First Philosophy

The system gatekeeps all resource creation behind a successful payment. No tenant or user exists until a license is generated.

### The Flow:

1. **Purchase**: User pays via an external provider (Gumroad, Stripe, etc.).
2. **Webhook (Activation)**:
   - Provider hits your internal API with `email` and `company_name`.
   - Your system creates a **License** first.
   - A **Tenant** is created, linked to that `license_id`.
   - A **User** (Admin) is created, linked to that `tenant_id`.
3. **The Handshake (Setup Link)**:
   - System sends an email: `app.com/setup?key={license_key}`.
   - This `license_key` acts as the secure bridge to "claim" the account.
4. **Identity Binding**:
   - On the setup page, the user chooses Google or Email/Password.
   - This creates the `user_identities` record, officially "activating" the admin.

## 2. Decoupled Authentication

We use a **User + Identity** pattern to separate the profile from the login method.

- Each user is strictly allowed **one** identity (no account merging).
- The `user_identities` table acts as the lookup for all login attempts.

## 3. Multi-Tenant Security (Hybrid RLS)

- **Primary Defense**: A `tenantWhere` utility used in every TypeORM query.
- **Secondary Defense (Firewall)**: Postgres Row Level Security (RLS) policies configured at the database level using `current_setting('app.current_tenant_id')`.
