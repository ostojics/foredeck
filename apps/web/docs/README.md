# Web Application Documentation

Welcome to the Foredeck web application documentation. This directory contains comprehensive guides for developers working on the frontend.

## Table of Contents

1. [HTTP Client](./http-client.md) - Type-safe HTTP client for API communication
2. [MSW Setup](./msw-setup.md) - API mocking for development and testing

## Quick Start

### HTTP Client

The HTTP client provides a type-safe wrapper around the native Fetch API with automatic error handling and Zod validation support.

```typescript
import {httpClient} from '@/lib/http-client';

// Simple GET request
const user = await httpClient.get<User>('/auth/me');

// POST with type safety
const response = await httpClient.post<LoginDTO, LoginResponse>('/auth/login', credentials);
```

See [http-client.md](./http-client.md) for complete documentation.

### MSW (Mock Service Worker)

MSW intercepts API requests during development, providing realistic responses without a live backend.

**Test Credentials:**

- Username: `demo`
- Password: `password`

See [msw-setup.md](./msw-setup.md) for complete documentation and handler examples.

## Development Workflow

1. **Start the dev server**: `pnpm dev`
2. **MSW initializes** automatically in development mode
3. **Make API calls** through the HTTP client
4. **MSW intercepts** and returns mock responses

## Architecture Overview

```
apps/web/src/
├── lib/
│   └── http-client.ts          # HTTP client service
├── mocks/
│   ├── browser.ts              # MSW worker setup
│   └── handlers/               # Mock API handlers
│       ├── auth-handlers.ts
│       ├── onboarding-handlers.ts
│       └── index.ts
└── modules/
    ├── api/                    # API functions
    │   ├── auth-api.ts
    │   └── onboarding-api.ts
    └── {feature}/
        └── hooks/              # TanStack Query hooks
```

## Related Documentation

- [Architecture](../../../_bmad-output/implementation-artifacts/architecture.md) - System architecture
- [Copilot Instructions](../../../.github/copilot-instructions.md) - Coding standards
- [Shared Contracts](../../../packages/contracts/README.md) - Zod schemas and types

## Support

For questions or issues:

1. Check the relevant documentation file
2. Review existing code examples in the codebase
3. Refer to the architecture documentation
