# Foredeck Architecture Document

**Date:** 2025-12-30  
**Project:** foredeck  
**Method:** bmad-method (greenfield)

---

## 1. Project Overview

Foredeck is a focused, playful SaaS platform purpose-built for small and mid-sized businesses (SMBs) to manage vacation and time-off with clarity, speed, and delight. It addresses the pain points of manual, error-prone processes (spreadsheets, emails), lack of real-time team visibility, and the complexity or cost of traditional HR tools. Foredeck delivers:

- Simple, transparent vacation request and approval flows for employees and managers
- Real-time team calendars and capacity dashboards
- Delightful, mobile-friendly UX with playful copy and micro-interactions
- Transparent, per-user pricing with no hidden fees

The platform is architected as a modern monorepo (Turborepo) with a type-safe, maintainable codebase. The initial implementation centers on the onboarding flow, ensuring frictionless adoption for new teams, with future modules planned to expand core time-off management capabilities.

---

## 2. High-Level System Architecture

### 2a. Backend Code Structure: Current and Future Plans

Currently, backend modules follow the NestJS modular pattern with clear separation of concerns:

- **Controllers**: Handle HTTP requests and responses, thin layer only.
- **Services**: Contain business logic, orchestrate repository calls, injectable.
- **Repositories**: Encapsulate all database access logic, use TypeORM.
- **Entities**: TypeORM entity definitions for DB tables.
- **Modules**: Register providers/controllers for each feature.

All layers use dependency injection for testability and modularity. Each feature is organized in its own folder with the following files:

```
feature/
  feature.entity.ts
  feature.controller.ts
  feature.module.ts
  feature.repository.ts
  feature.service.ts
```

**Note:** We will be introducing Clean Architecture and Domain Driven Design (DDD) for the backend soon. For now, we follow the above structure. Future updates will refactor modules to align with DDD boundaries, domain models, and use cases.

**Monorepo Structure:**

- **apps/core**: NestJS backend API (TypeORM, Express, Pino logging)
- **apps/web**: React (Vite) frontend (TanStack Router/Query, SCSS Modules, BEM)
- **packages/contracts**: Shared Zod schemas and TypeScript types for API contracts
- **tooling/**: Shared configuration (ESLint, TypeScript)

**Diagram (textual):**

```
+-------------------+         +-------------------+
|   Frontend (web)  | <-----> |   Backend (core)  |
|  React + Vite     |   API   |  NestJS + TypeORM |
+-------------------+         +-------------------+
         ^                           ^
         |                           |
         +--------+  Shared  +-------+
                  | Contracts |
                  +-----------+
```

---

## 3. Technology Choices & Rationale

- **NestJS (Backend):** Modular, scalable, TypeScript-first, strong ecosystem.
- **React + Vite (Frontend):** Fast dev/build, modern React features, modular SCSS.
- **Zod (Contracts):** Single source of truth for validation/types (frontend & backend).
- **TanStack Query/Router:** Robust data fetching and routing.
- **TypeORM:** Flexible ORM for relational DBs.
- **Pino:** High-performance logging.
- **Turborepo:** Efficient monorepo management.

---

## 4. Module & Component Breakdown

### Backend (`apps/core`)

#### Backend Validation & Security Patterns

- **Zod Validation Pipe**: All request validation uses Zod schemas via a custom validation pipe. This ensures type safety and clear error messages. Schemas are defined close to DTOs and reused across modules. On validation failure, a `BadRequestException` is thrown with detailed Zod error objects.
- **Password Hashing**: Passwords are hashed using a secure algorithm (bcrypt/Argon2) before storage. Verification is done by comparing the hash of the provided password with the stored hash. All password operations are asynchronous and use salted hashes.
- **JWT Auth with HttpOnly Cookies**: Authentication uses JWTs sent as HttpOnly cookies for security. Tokens are never exposed to JavaScript. Guards extract and validate JWTs from cookies. Logout clears the cookie. Always use Secure and SameSite flags.
- **Swagger/OpenAPI**: API documentation is auto-generated from controller and DTO metadata using NestJS Swagger. DTOs are annotated with both validation and documentation decorators for clarity and type safety.

### Frontend (`apps/web`)

### Frontend (`apps/web`)

- **Pages/Routes:** Organized by feature (e.g., onboarding).
- **Components:** SCSS Modules, BEM, forwardRef, accessible.
- **State Management:** TanStack Query (server state), Context (UI state, where applicable, never use context for data that changes very often and impacts big parts of the app).
- **Forms:** react-hook-form + Zod schemas from contracts.
- **Theming:** CSS variables, theme switching via data attributes.

### Shared Contracts (`packages/contracts`)

- **Zod Schemas:** API request/response validation.
- **TypeScript Types:** Inferred from schemas, shared across apps.

---

## 5. Data Flow & Integration Points

- **Frontend** calls **Backend** via REST API, using types from contracts for requests/responses.
- **Backend** validates input using Zod schemas (same as frontend).
- **Database** managed via TypeORM, entities mapped to DTOs.
- **Shared contracts** ensure type safety and validation consistency.

---

## 6. Key Patterns, Conventions, and Standards

- **File Naming:** Kebab-case for all files/folders.
- **Component Structure:** One folder per component, SCSS Modules, BEM.
- **Hooks/Context:** Custom hooks for queries/mutations/context, error handling.
- **No Barrel Exports:** Direct imports only.
- **TypeScript Strict Mode:** No `any`, prefer interfaces/types as per guidelines.
- **Accessibility:** Semantic HTML, ARIA, keyboard navigation.
- **Styling:** CSS variables, rem units, BEM, no hardcoded colors.
- **SCSS Coding Pattern:** Always use a single base class for each component (e.g., `.button`), and nest all BEM elements (`&__element`) and modifiers (`&--modifier`) within that base class using SCSS parent selector nesting. Do not create new classes for each element; instead, structure your SCSS so that all elements and modifiers are encapsulated under the base block. This ensures flat specificity, maintainable styles, and clear component architecture. Example:

  ```scss
  .button {
    // base styles
    &__icon {
      // icon element styles
    }
    &--primary {
      // primary modifier styles
    }
  }

  ### Backend Patterns
  - **Modular Feature Folders:** One feature per module, maintainable and scalable.
  - **Thin Controllers, Fat Services:** Business logic in services, not controllers.
  - **Repositories for DB Access:** All database operations go through repositories.
  - **Dependency Injection:** Used throughout for testability and modularity.
  - **DTOs and Validation:** Use Zod schemas for validation, DTOs for request/response shapes, annotated for Swagger.
  - **JWT Auth:** Use HttpOnly cookies, secure flags, and guards for authentication.
  - **Password Security:** Hash all passwords before storage, verify securely.
  - **No Barrel Exports:** Direct imports only.
  - **TypeScript Strict Mode:** No `any`, prefer interfaces/types as per guidelines.

  ### Frontend Patterns
  - **File Naming:** Kebab-case for all files/folders.
  - **Design System** We are utilizing Base UI for component primitives and Figma designs for styling guidance
  - **Component Structure:** One folder per component, SCSS Modules, BEM.
  - **Hooks/Context:** Custom hooks for queries/mutations/context, error handling.
  - **No Barrel Exports:** Direct imports only.
  - **TypeScript Strict Mode:** No `any`, prefer interfaces/types as per guidelines.
  - **Accessibility:** Semantic HTML, ARIA, keyboard navigation.
  - **Styling:** CSS variables, rem units, BEM, no hardcoded colors.
  - **SCSS Coding Pattern:** Always use a single base class for each component (e.g., `.button`), and nest all BEM elements (`&__element`) and modifiers (`&--modifier`) within that base class using SCSS parent selector nesting. Do not create new classes for each element; instead, structure your SCSS so that all elements and modifiers are encapsulated under the base block. This ensures flat specificity, maintainable styles, and clear component architecture. Example:
  - Onboarding pages (stepper or wizard pattern)
  - Form validation via Zod schemas
  - API calls via TanStack Query hooks
  - Error handling and toasts for feedback
  ```

- **Backend:**
  - Onboarding controller/routes
  - Validation pipes using shared Zod schemas
  - Auth/session management
  - Persistence of onboarding state
- **Contracts:**
  - Zod schemas for onboarding steps, responses, and errors

---

## 8. Extensibility & Future-Proofing

- **Modular Feature Folders:** Both frontend and backend organized by feature for scalability.
- **Shared Contracts:** All new features must define/update Zod schemas in contracts.
- **Code Splitting:** Lazy load routes/components for performance.
- **Testing:** (To be expanded) Unit/integration tests for all modules. Not for now.
- **Workflow:** All new features follow bmad-method planning and documentation standards.
- **Documentation** Methods and utilities should be documented using JSDoc where applicable, we should avoid code comments

---

## 9. References

- [copilot-instructions.md](../../.github/copilot-instructions.md)
- [theme-and-colors.md](../../docs/ui/theme-and-colors.md)
- [prd.md](../planning-artifacts/prd.md)
- [product-brief.md](../planning-artifacts/product-brief.md)
- [onboarding-user-flows.md](../analysis/onboarding-user-flows.md)
- [onboarding-ux-design.md](../analysis/onboarding-ux-design.md)

---

_This document is a living artifact and should be updated as the architecture evolves._
