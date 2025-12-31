# MSW (Mock Service Worker) Setup Documentation

## Overview

MSW (Mock Service Worker) is configured for the Foredeck web app to enable API mocking during development. This allows frontend development to proceed independently of the backend, with realistic API responses and network behavior.

## What is MSW?

MSW intercepts network requests at the browser level using Service Workers. This means:

- No changes to application code
- Realistic network conditions (delays, errors)
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

### Authentication Endpoints

#### POST `/auth/login`

Authenticates a user and returns a session cookie.

**Request:**

```typescript
{
  username: string;
  password: string;
}
```

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

**Test Credentials:**

- Username: `demo`
- Password: `password`

**Error Responses:**

- `400` - Validation failed
- `401` - Invalid credentials

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

**Error Response:**

- `401` - Unauthorized (no session cookie)

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

**Error Responses:**

- `400` - Validation failed
- `409` - User already exists (email: `existing@foredeck.app`)

## Adding New Mock Handlers

### Step 1: Create a Handler File

Create a new file in `src/mocks/handlers/` for your feature:

```typescript
// src/mocks/handlers/vacation-handlers.ts
import {http, HttpResponse} from 'msw';

const API_URL = 'http://localhost:3000/api';

export const vacationHandlers = [
  // GET vacation requests
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

  // POST create vacation request
  http.post(`${API_URL}/vacations`, async ({request}) => {
    const body = await request.json();

    return HttpResponse.json(
      {
        id: `vac-${Date.now()}`,
        ...body,
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

### Using Zod Validation

Always validate requests using shared Zod schemas:

```typescript
import {http, HttpResponse} from 'msw';
import {createVacationSchema} from '@acme/contracts';

export const vacationHandlers = [
  http.post(`${API_URL}/vacations`, async ({request}) => {
    const body = await request.json();

    // Validate with Zod
    const result = createVacationSchema.safeParse(body);

    if (!result.success) {
      return HttpResponse.json(
        {
          message: 'Validation failed',
          errors: result.error.errors.map((err) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        },
        {status: 400},
      );
    }

    // Process valid data
    return HttpResponse.json({success: true}, {status: 201});
  }),
];
```

### Simulating Network Delay

Add realistic delays to simulate network conditions:

```typescript
http.post(`${API_URL}/vacations`, async ({request}) => {
  // Simulate 1-2 second delay
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

  return HttpResponse.json({success: true});
});
```

### Handling Query Parameters

```typescript
http.get(`${API_URL}/vacations`, ({request}) => {
  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const page = url.searchParams.get('page') || '1';

  // Filter and paginate data based on params
  const filteredData = mockData.filter((item) => !status || item.status === status);

  return HttpResponse.json({
    data: filteredData,
    page: parseInt(page),
    total: filteredData.length,
  });
});
```

### Handling Path Parameters

```typescript
http.get(`${API_URL}/vacations/:id`, ({params}) => {
  const {id} = params;

  const vacation = mockData.find((v) => v.id === id);

  if (!vacation) {
    return HttpResponse.json({message: 'Vacation not found'}, {status: 404});
  }

  return HttpResponse.json(vacation);
});
```

### Working with Cookies

```typescript
http.get(`${API_URL}/protected`, ({cookies}) => {
  if (!cookies.session) {
    return HttpResponse.json({message: 'Unauthorized'}, {status: 401});
  }

  return HttpResponse.json({data: 'Protected data'});
});

http.post(`${API_URL}/login`, async ({request}) => {
  // ... validate credentials ...

  return HttpResponse.json(
    {success: true},
    {
      headers: {
        'Set-Cookie': 'session=token; HttpOnly; Secure; SameSite=Strict',
      },
    },
  );
});
```

### Simulating Errors

```typescript
http.post(`${API_URL}/vacations`, async ({request}) => {
  const body = await request.json();

  // Simulate server error for specific condition
  if (body.startDate === '2024-12-25') {
    return HttpResponse.json({message: 'Cannot request vacation on holidays'}, {status: 400});
  }

  // Simulate random server errors (10% chance)
  if (Math.random() < 0.1) {
    return HttpResponse.json({message: 'Internal server error'}, {status: 500});
  }

  return HttpResponse.json({success: true});
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
http.post(`${API_URL}/vacations`, async ({request}) => {
  const body = await request.json();
  console.log('[MSW] POST /vacations:', body);

  return HttpResponse.json({success: true});
});
```

MSW will log unhandled requests in the console with `[MSW] Warning: captured a request without a matching request handler`.

## Best Practices

1. **Mirror Real API**: Mock responses should match the actual API structure
2. **Use Shared Schemas**: Always validate with Zod schemas from `@acme/contracts`
3. **Realistic Data**: Use realistic mock data that covers edge cases
4. **Proper Status Codes**: Return appropriate HTTP status codes (200, 201, 400, 401, 404, 500)
5. **Include Delays**: Add network delays to test loading states
6. **Error Scenarios**: Test error handling with various error responses
7. **Document Handlers**: Add comments explaining complex mock logic
8. **Keep DRY**: Extract common mock data to constants

## Mock Data Management

For complex features, organize mock data in separate files:

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
  // ... more entries
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
