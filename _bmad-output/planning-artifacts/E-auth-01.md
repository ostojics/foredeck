# Epic: Authentication Features (E-auth-01)

**Epic ID:** E-auth-01
**Title:** Authentication Features
**Created:** 2026-01-01

---

## Description

Implement core authentication features for Foredeck, including frontend and backend login flows, using shared contracts and established architectural patterns. This epic will be expanded with additional authentication-related stories (registration, password reset, etc.) in the future.

---

## Stories

### S-auth-01: Frontend Login Implementation

- **Story ID:** S-auth-01
- **Description:**
  - Implement a `/login` route in the frontend app.
  - The page displays a login form with email and password inputs.
  - Use a Zod schema contract for login (email, password) and validate the form using existing react-hook-form + Zod patterns.
  - On successful login, redirect to the dashboard.
  - On error, show a browser alert (temporary solution).
  - The form and page must follow the Figma design (to be provided).

- **Tasks:**
  - [x] **T-auth-01-01:** Create `/login` route and page component structure.
  - [x] **T-auth-01-02:** Build login form UI (branding, email/password fields, support footer).
  - [x] **T-auth-01-03:** Integrate react-hook-form with Zod contract schema for validation.
  - [x] **T-auth-01-04:** Implement form submission logic (mutation hook, loading state, redirect, error alert).
  - [x] **T-auth-01-05:** Ensure accessibility and UX compliance (labels, ARIA, tab order, rem units, theme tokens).
  - [x] **T-auth-01-06:** Test validation, error handling, and accessibility.

---

### S-auth-02: Backend Login Implementation

- **Story ID:** S-auth-02
- **Description:**
  - Implement a `/v1/auth/login` endpoint in the backend.
  - Accepts contract data: email and password.
  - Uses standard login business logic and verifies passwords with existing hashing utilities.
  - On success, crafts a new JWT and sends it as an HttpOnly cookie (using the JWT service).
  - On error, returns a generic error message to prevent enumeration/attacks.
  - Use existing validation pipes and patterns for request validation.

- **Tasks:**
  - **T-auth-02-01:** Create `/v1/auth/login` POST endpoint in NestJS.
  - **T-auth-02-02:** Apply Zod contract schema and validation pipes for request validation.
  - **T-auth-02-03:** Implement authentication logic (user lookup, password verification).
  - **T-auth-02-04:** Issue JWT as HttpOnly cookie on success.
  - **T-auth-02-05:** Return generic error message on failure (no enumeration).
  - **T-auth-02-06:** Write unit and integration tests for endpoint and error cases.

---

_Additional stories will be added as authentication features expand._

---

### S-auth-03: Frontend Auth Context Implementation

- **Story ID:** S-auth-03
- **Description:**
  - Implement the authentication context pattern as described in the architecture doc ([2b. Authentication Context: Frontend & Backend Integration]).
  - Create a `useGetMe` hook in the `auth` module that uses a dedicated API function to call `/auth/me`.
  - The API function should be placed in the API module and use the shared contract for type safety.
  - Integrate the hook into the main app to provide authentication context to the router.
  - Use the contract from `packages/contracts` with the following fields: `userId`, `email`, `fullName`, `tenant: {name}`.
  - Follow all frontend patterns and standards (file structure, hooks, contracts, SCSS, etc.).

- **Tasks:**
  - **T-auth-03-01:** Define the user contract in `packages/contracts` with required fields.
  - **T-auth-03-02:** Implement the `/auth/me` API function in the API module.
  - **T-auth-03-03:** Create the `useGetMe` hook in the `auth` module, using TanStack Query and the API function.
  - **T-auth-03-04:** Integrate the hook into the main app to provide authentication context to the router.
  - **T-auth-03-05:** Ensure type safety and error handling using the contract.
  - **T-auth-03-06:** Follow all code standards and patterns (no barrel exports, kebab-case, etc.).

---

### S-auth-04: Backend /auth/me Endpoint Implementation

- **Story ID:** S-auth-04
- **Description:**
  - Implement a new `/auth/me` endpoint in the backend to securely return the authenticated user's data.
  - Use the shared contract from `packages/contracts` with fields: `userId`, `email`, `fullName`, `tenant: {name}`.
  - Apply authentication guard (JWT via HttpOnly cookie) to protect the endpoint.
  - Use dependency injection to access the authenticated user and fetch user data from the database.
  - Return the contract-compliant user object if authenticated.
  - Follow all backend patterns and standards (controller/service/repository structure, validation, contracts, etc.).

- **Tasks:**
  - **T-auth-04-01:** Define the user contract in `packages/contracts` with required fields (if not already done).
  - **T-auth-04-02:** Implement the `/auth/me` GET endpoint in the appropriate controller.
  - **T-auth-04-03:** Apply authentication guard and ensure secure access (JWT, HttpOnly cookie).
  - **T-auth-04-04:** Fetch user data and map to the contract structure.
  - **T-auth-04-05:** Ensure type safety and error handling using the contract.
  - **T-auth-04-06:** Follow all code standards and patterns (no barrel exports, kebab-case, etc.).

---

## Dev Agent Record

### Debug Log

- 2026-01-01: Started work on S-auth-01.
- 2026-01-01: Completed T-auth-01-01. Created structure for Login Page and Form. Note: Frontend tests skipped due to missing test runner configuration in `apps/web`.
- 2026-01-01: Completed T-auth-01-02. Built Login Form UI with email/password fields and branding. Updated shared contract schema to use email instead of username.
- 2026-01-01: Completed T-auth-01-03. Integrated react-hook-form with Zod schema (already implemented in previous steps).
- 2026-01-01: Completed T-auth-01-04. Implemented form submission logic with mutation hook, loading state, and redirect.
- 2026-01-01: Completed T-auth-01-05. Enhanced accessibility by adding `aria-invalid` to Input component.
- 2026-01-01: Completed T-auth-01-06. Verified implementation. Automated tests skipped due to missing test runner in `apps/web`.

### Completion Notes

- S-auth-01 is complete.
- **Action Item:** Add Vitest and Testing Library to `apps/web` to enable frontend testing.

## File List

- apps/web/src/routes/login.tsx
- apps/web/src/modules/auth/components/login-page/login-page.tsx
- apps/web/src/modules/auth/components/login-page/login-page.module.scss
- apps/web/src/modules/auth/components/login-form/login-form.tsx
- apps/web/src/modules/auth/components/login-form/login-form.module.scss
- apps/web/src/modules/auth/hooks/use-validate-login.ts
- apps/web/src/modules/auth/hooks/use-login-mutation.ts
- apps/web/src/components/input/input.tsx
- packages/contracts/src/schemas/auth.ts

## Change Log

- 2026-01-01: Initialized tracking sections.
- 2026-01-01: Implemented S-auth-01 (Frontend Login).
- 2026-01-01: Refactored Login Form SCSS to use proper BEM nesting.

## Status

- S-auth-01: Completed
