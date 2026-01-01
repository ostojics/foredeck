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
  - **T-auth-01-01:** Create `/login` route and page component structure.
  - **T-auth-01-02:** Build login form UI (card layout, branding, email/password fields, show/hide toggle, support footer).
  - **T-auth-01-03:** Integrate react-hook-form with Zod contract schema for validation.
  - **T-auth-01-04:** Implement form submission logic (mutation hook, loading state, redirect, error alert).
  - **T-auth-01-05:** Ensure accessibility and UX compliance (labels, ARIA, tab order, rem units, theme tokens).
  - **T-auth-01-06:** Test validation, error handling, and accessibility.

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
