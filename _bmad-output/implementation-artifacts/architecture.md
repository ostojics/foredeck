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

- **API Layer:** REST endpoints, DTOs from contracts, validation pipes.
- **Auth Module:** Handles onboarding authentication (see onboarding flow).
- **Database Layer:** TypeORM entities, migrations.
- **Config/Logging:** Centralized config, Pino logging.

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
  ```

  See `button.module.scss` for a full example.

---

## 7. Onboarding Flow Architecture (Initial Focus)

- **Frontend:**
  - Onboarding pages (stepper or wizard pattern)
  - Form validation via Zod schemas
  - API calls via TanStack Query hooks
  - Error handling and toasts for feedback
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
