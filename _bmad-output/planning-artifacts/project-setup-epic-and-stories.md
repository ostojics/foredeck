# Epic: Project Setup

**Epic ID:** E-setup-02

## Epic Description

Establish the foundational technical setup for the Foredeck platform, ensuring all core infrastructure, libraries, and patterns are in place for rapid, maintainable development. This includes HTTP client, MSW for API mocking, Zod validation pipe, JWT authentication, and secure password hashing utilities.

### Acceptance Criteria

- All setup modules are implemented and documented.
- Code follows architecture and coding standards.
- All modules are testable and ready for feature development.

---

## User Stories

### Story 1: HTTP Client Setup

**Story ID:** S-setup-01

**As a** developer,
**I want** a robust, type-safe HTTP client configured for API communication,
**so that** frontend and backend modules can reliably interact with the API using shared contracts.

**Acceptance Criteria:**

- HTTP client is configured in apps/web and apps/core as needed.
- Uses shared types from packages/contracts.
- Handles errors and responses consistently.
- Documented usage examples for both apps.

#### Sprint Tasks

- Implement HTTP client configuration in web and core **Task ID:** T-setup-01-01
- Integrate shared types for request/response **Task ID:** T-setup-01-02
- Add error handling and response normalization **Task ID:** T-setup-01-03
- Write documentation and usage examples **Task ID:** T-setup-01-04

---

### Story 2: MSW Setup

**Story ID:** S-setup-02

**As a** frontend developer,
**I want** to use MSW (Mock Service Worker) for API mocking during development and testing,
**so that** I can develop and test UI components without relying on a live backend.

**Acceptance Criteria:**

- MSW is configured in apps/web.
- Mock handlers are defined for core API endpoints.
- Documentation for adding new handlers is provided.

#### Sprint Tasks

- Configure MSW in web app **Task ID:** T-setup-02-01
- Implement mock handlers for onboarding and auth endpoints **Task ID:** T-setup-02-02
- Document MSW usage and handler extension **Task ID:** T-setup-02-03

---

### Story 3: Zod Validation Pipe Setup

**Story ID:** S-setup-03

**As a** backend developer,
**I want** a custom Zod validation pipe integrated with NestJS,
**so that** all incoming requests are validated against shared Zod schemas for type safety and clear error messages.

**Acceptance Criteria:**

- Zod validation pipe is implemented in apps/core.
- Uses schemas from packages/contracts.
- Throws BadRequestException with Zod error details on failure.
- Documented usage in controller examples.

#### Sprint Tasks

- Implement Zod validation pipe in NestJS **Task ID:** T-setup-03-01
- Integrate with shared contracts schemas **Task ID:** T-setup-03-02
- Add error handling and exception mapping **Task ID:** T-setup-03-03
- Write documentation and controller usage examples **Task ID:** T-setup-03-04

---

### Story 4: JWT Module and Service Setup

**Story ID:** S-setup-04

**As a** backend developer,
**I want** a JWT module and service for authentication,
**so that** secure, stateless user sessions can be managed using HttpOnly cookies.

**Acceptance Criteria:**

- JWT module/service is implemented in apps/core.
- Tokens are issued, validated, and revoked securely.
- HttpOnly, Secure, and SameSite flags are used for cookies.
- Documented usage and integration with auth guards.

#### Sprint Tasks

- Implement JWT module and service in NestJS **Task ID:** T-setup-04-01
- Integrate cookie handling with secure flags **Task ID:** T-setup-04-02
- Add token validation and revocation logic **Task ID:** T-setup-04-03
- Write documentation and guard integration examples **Task ID:** T-setup-04-04

---

### Story 5: Password Hashing Utils with Argon2

**Story ID:** S-setup-05

**As a** backend developer,
**I want** password hashing utilities using Argon2,
**so that** user passwords are stored securely and verified safely during authentication.

**Acceptance Criteria:**

- Argon2 password hashing utils are implemented in apps/core.
- Passwords are hashed and verified asynchronously.
- Utilities are documented and tested.

#### Sprint Tasks

- Implement Argon2 password hashing utility **Task ID:** T-setup-05-01
- Add password verification logic **Task ID:** T-setup-05-02
- Write documentation and usage examples **Task ID:** T-setup-05-03

---

_Document generated: 2025-12-31_
