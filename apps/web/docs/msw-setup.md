# MSW (Mock Service Worker) Setup Documentation

## Overview

MSW (Mock Service Worker) is configured for the Foredeck web app to enable API mocking during development. This allows frontend development to proceed independently of the backend, with simple mock responses for testing the happy path.

## What is MSW?

MSW intercepts network requests at the browser level using Service Workers. This means:

- No changes to application code
- Works with any HTTP client (fetch, axios, etc.)
- Can be enabled/disabled per environment

## Setup

MSW is automatically enabled in **development mode only**. It initializes before the React app renders.

### Configuration Files

```
apps/web/
├── src/
│   ├── mocks/
│   │   ├── browser.ts          # MSW worker setup
│   │   └── handlers/
│   │       ├── index.ts        # Exports all handlers
│   │       ├── auth-handlers.ts      # Auth endpoints
│   │       └── onboarding-handlers.ts # Onboarding endpoints
│   └── main.tsx                # MSW initialization
└── public/
    └── mockServiceWorker.js    # MSW worker script (auto-generated)
```

## Current Mock Endpoints

All endpoints return successful responses (happy path only) to allow UI development and testing.

### Authentication Endpoints

#### POST `/auth/login`

Authenticates a user and returns a session cookie.

**Success Response (200):**

```typescript
{
  user: {
    id: string;
    email: string;
    fullName: string;
  }
}
```

#### GET `/auth/me`

Returns the currently authenticated user.

**Success Response (200):**

```typescript
{
  id: string;
  email: string;
  fullName: string;
}
```

#### POST `/auth/logout`

Logs out the current user and clears the session cookie.

**Success Response (200):**

```typescript
{
  success: true;
}
```

### Onboarding Endpoints

#### POST `/auth/register`

Creates a new account and company during onboarding.

**Request:**

```typescript
{
  companyName: string;
  companyUrl?: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
```

**Success Response (201):**

```typescript
{
  success: true;
  userId: string;
}
```

## Adding New Mock Handlers

### Step 1: Create a Handler File

Create a new file in `src/mocks/handlers/` for your feature:

```typescript
// src/mocks/handlers/vacation-handlers.ts
import {http, HttpResponse} from 'msw';

const API_URL = 'http://localhost:3000/api';

export const vacationHandlers = [
  // GET vacation requests - happy path
  http.get(`${API_URL}/vacations`, () => {
    return HttpResponse.json([
      {
        id: '1',
        employeeName: 'John Doe',
        startDate: '2024-01-15',
        endDate: '2024-01-20',
        status: 'approved',
      },
    ]);
  }),

  // POST create vacation request - happy path
  http.post(`${API_URL}/vacations`, () => {
    return HttpResponse.json(
      {
        id: `vac-${Date.now()}`,
        status: 'pending',
      },
      {status: 201},
    );
  }),
];
```

### Step 2: Export Handlers

Add your handlers to `src/mocks/handlers/index.ts`:

```typescript
import {authHandlers} from './auth-handlers';
import {onboardingHandlers} from './onboarding-handlers';
import {vacationHandlers} from './vacation-handlers';

export const handlers = [...authHandlers, ...onboardingHandlers, ...vacationHandlers];
```

## Handler Patterns

### Simple Mock Response

Handlers should return successful responses for the happy path:

```typescript
import {http, HttpResponse} from 'msw';

const API_URL = 'http://localhost:3000/api';

export const vacationHandlers = [
  http.post(`${API_URL}/vacations`, () => {
    return HttpResponse.json(
      {
        id: `vac-${Date.now()}`,
        status: 'pending',
      },
      {status: 201},
    );
  }),
];
```

### Returning Mock Data

Return static or generated mock data for GET requests:

```typescript
http.get(`${API_URL}/vacations`, () => {
  return HttpResponse.json([
    {
      id: '1',
      employeeName: 'John Doe',
      startDate: '2024-01-15',
      endDate: '2024-01-20',
      status: 'approved',
    },
  ]);
});
```

### Handling Path Parameters

Access path parameters when needed:

```typescript
http.get(`${API_URL}/vacations/:id`, ({params}) => {
  const {id} = params;

  return HttpResponse.json({
    id,
    employeeName: 'John Doe',
    status: 'approved',
  });
});
```

## Development Workflow

### Checking MSW Status

When the app loads in development, you should see in the browser console:

```
[MSW] Mocking enabled.
```

### Bypassing MSW for Real API

To temporarily test against a real backend:

1. **Option 1**: Comment out MSW initialization in `main.tsx`
2. **Option 2**: Set `VITE_API_URL` to your backend URL in `.env.local`

### Debugging Handlers

Add console logs to see intercepted requests:

```typescript
http.post(`${API_URL}/vacations`, () => {
  console.log('[MSW] POST /vacations called');

  return HttpResponse.json({success: true});
});
```

MSW will log unhandled requests in the console with `[MSW] Warning: captured a request without a matching request handler`.

## Best Practices

1. **Keep It Simple**: Return successful responses for happy path scenarios
2. **Mirror Real API**: Mock responses should match the actual API structure
3. **Mock Data**: Use realistic mock data for testing UI components
4. **Document Handlers**: Add comments explaining what each handler returns

## Mock Data Management

For reusable mock data, organize it in separate files:

```typescript
// src/mocks/data/vacation-data.ts
export const mockVacations = [
  {
    id: '1',
    employeeName: 'John Doe',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    status: 'approved',
  },
];

// src/mocks/handlers/vacation-handlers.ts
import {mockVacations} from '../data/vacation-data';

http.get(`${API_URL}/vacations`, () => {
  return HttpResponse.json(mockVacations);
});
```

## Disabling MSW

To disable MSW (e.g., for production or when using a real backend):

The MSW setup automatically disables itself in non-development environments. It checks:

```typescript
if (import.meta.env.MODE !== 'development') {
  return; // MSW is not started
}
```

## Troubleshooting

### MSW Not Starting

1. Check browser console for errors
2. Verify `mockServiceWorker.js` exists in `public/` directory
3. Ensure service worker is registered (check Chrome DevTools > Application > Service Workers)

### Requests Not Being Intercepted

1. Verify handler URL matches the request URL exactly
2. Check that the handler is exported in `handlers/index.ts`
3. Clear browser cache and service worker cache

### Re-initializing MSW Worker

If you need to regenerate the worker script:

```bash
cd apps/web
npx msw init public/ --save
```

## Related Documentation

- [HTTP Client](./http-client.md) - Type-safe HTTP client
- [MSW Official Docs](https://mswjs.io/docs/) - Complete MSW documentation
- [Shared Contracts](../../../packages/contracts/README.md) - Zod schemas
