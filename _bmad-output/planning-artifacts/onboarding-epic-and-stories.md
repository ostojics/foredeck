# Epic: User Onboarding Flow

**Epic ID:** E-onboarding-01

# Epic: User Onboarding Flow

_Document generated: 2025-12-31_

# Epic: User Onboarding Flow

**Epic ID:** E-onboarding-01

## Epic Description

Design and implement a seamless onboarding experience for new users, guiding them from account creation through initial setup and first successful use of the platform. The onboarding flow should be intuitive, accessible, and provide clear value, reducing friction and increasing activation rates.

### Acceptance Criteria

- New users can register and verify their account.
- All onboarding steps are accessible and mobile-friendly.

---

## User Stories

### Story 1: Database Migrations for Onboarding Entities

**Story ID:** S-onboarding-01

**As a** developer,
**I want** to create database migrations for the onboarding-related entities (Licenses, Tenants, Users, User Identities),
**so that** the system has a robust, multi-tenant foundation for onboarding and authentication.

**Acceptance Criteria:**

- Migrations are created for the following tables: `licenses`, `tenants`, `users`, `user_identities`.
- All columns, types, constraints, and relationships match the initial schema specification (see docs/general/initial-schemas.md).
- `user_identities` table enforces unique (provider, provider_id) and NOT NULL constraints as described.
- Foreign key relationships are established (tenant to license, user to tenant, identity to user).
- Migration files are placed in `apps/core/src/migrations` and use the following TypeORM syntax:

```typescript
import {MigrationInterface, QueryRunner} from 'typeorm';

export class ExampleMigrationName1234567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
    await queryRunner.query(`DO $$ BEGIN
	CREATE TYPE transaction_type_enum AS ENUM ('income', 'expense');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TYPE IF EXISTS transaction_type_enum;`);
  }
}
```

- Migration scripts are idempotent and tested locally.
- Rollback scripts are provided.
- Documentation links to the schema reference.

#### Sprint Tasks

- Design database schema for licenses, tenants, users, user_identities (reference initial-schemas.md) **Task ID:** T-onboarding-01-01
- Implement TypeORM migration scripts for each table **Task ID:** T-onboarding-01-02
- Add unique and NOT NULL constraints to user_identities **Task ID:** T-onboarding-01-03
- Establish foreign key relationships **Task ID:** T-onboarding-01-04
- Test migrations locally for idempotency **Task ID:** T-onboarding-01-05
- Write rollback scripts **Task ID:** T-onboarding-01-06
- Document migration process and link to schema reference **Task ID:** T-onboarding-01-07

---

### Story 2: Onboarding UI Implementation (Web)

**Story ID:** S-onboarding-02

**As a** new user,
**I want** a clear, accessible onboarding form to set up my company and account,
**so that** I can quickly and confidently get started with Foredeck.

**Acceptance Criteria:**

- UI matches the UX design and user flows (see \_bmad-output/analysis/onboarding-ux-design.md and onboarding-user-flows.md).
- Figma design links will be provided; the developer must follow the specified style, look, and feel in addition to the required fields and flows.
- Form fields: Company Name (required), Company URL (optional), Full Name (required), Email (required), Password (required, min 8 chars), Confirm Password (required, must match).
- Uses react-hook-form with Zod contracts for validation (contracts defined in packages/contracts).
- All validation hooks (e.g., onboarding, registration) must follow the same abstraction pattern as the useValidateLogin hook in apps/web/src/modules/auth/hooks/use-validate-login.ts: encapsulate useForm logic in a custom hook, use standardSchemaResolver with the appropriate Zod schema, set defaultValues, and export the hook for use in forms.
- Inline validation errors under each field; submit button always enabled, shows loading state on submit.
- Accessibility: proper labels, tab order, ARIA attributes.
- On success: show confirmation page and auto-redirect to dashboard.
- On error: show toast notification with error message and support contact.
- Responsive, mobile-friendly layout using BEM SCSS and theme tokens.
- All copy and flows match the research and UX docs.

#### Sprint Tasks

- Design onboarding form UI (company info, account info) **Task ID:** T-onboarding-02-01
- Implement form in React (using react-hook-form + Zod) **Task ID:** T-onboarding-02-02
- Add client-side validation and error handling **Task ID:** T-onboarding-02-03
- Integrate form submission with backend API (add only the tanstack query query with mock promise resolve for now) **Task ID:** T-onboarding-02-04
- Implement loading and success states **Task ID:** T-onboarding-02-05
- Ensure accessibility and mobile responsiveness **Task ID:** T-onboarding-02-06
- Write tests for form validation and submission **Task ID:** T-onboarding-02-07
- Reference Figma for design aesthetics and layout guides **Task ID:** T-onboarding-02-08

---

### Story 3: Backend Onboarding Endpoint & Persistence

**Story ID:** S-onboarding-03

**As a** software engineer,
**I want** to implement a secure onboarding API endpoint that stores new company, license, and user records, issues a JWT, and documents the contract,
**so that** onboarding submissions are validated, persisted, and ready for first login with a secure session.

**Acceptance Criteria:**

- The onboarding contract (Zod schema in packages/contracts) is extended to include a required `license_key` field.
- POST endpoint is available at `/v1/onboarding` and accepts a validated payload matching the onboarding form, including `license_key`.
- Backend uses validation pipes and Swagger DTOs for request/response validation and documentation (existing setup).
- On success, backend creates new license, tenant, user, and user_identity records in the database using TypeORM entities (to be added if missing), all in a single transaction.
- Passwords are securely hashed (for 'local' provider).
- On successful onboarding, backend issues a new JWT for the user and sets it in an HTTP-only cookie (using the existing JWT service and cookie setup).
- Returns appropriate success or error responses; errors are handled and surfaced to the frontend.
- Endpoint is fully documented and discoverable for frontend integration (Swagger/OpenAPI).
- When the frontend receives a successful response, it redirects to the onboarding success page (already implemented).
- The frontend must automatically add the license key in the default values for react-hook-form validation, so that the license key is always included in the onboarding form submission and validation.

#### Sprint Tasks

- Extend onboarding contract in `packages/contracts` to include `license_key` **Task ID:** T-onboarding-03-01
- Add/Update TypeORM entities for license, tenant, user, and user_identity as needed **Task ID:** T-onboarding-03-02
- Implement POST `/v1/onboarding` endpoint in backend **Task ID:** T-onboarding-03-03
- Use validation pipes and Swagger DTOs for request/response validation and documentation **Task ID:** T-onboarding-03-04
- Implement service logic to persist license, tenant, user, and user_identity in a single transaction **Task ID:** T-onboarding-03-05
- Implement secure password hashing for 'local' provider **Task ID:** T-onboarding-03-06
- On success, issue JWT and set in HTTP-only cookie **Task ID:** T-onboarding-03-07
- Handle and return appropriate error responses **Task ID:** T-onboarding-03-08
- Document the endpoint for frontend and API consumers (Swagger/OpenAPI) **Task ID:** T-onboarding-03-09
- Update the frontend onboarding form logic to automatically include the license key in the default values for react-hook-form validation **Task ID:** T-onboarding-03-10

---

_Document generated: 2025-12-31_
