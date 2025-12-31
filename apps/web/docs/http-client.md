# HTTP Client Documentation

## Overview

The HTTP client is a type-safe wrapper around the native Fetch API, providing a consistent interface for making API requests with automatic error handling, request/response normalization, and integration with shared Zod schemas from `@acme/contracts`.

## Features

- **Type-Safe**: Full TypeScript support with generic types for requests and responses
- **Automatic Error Handling**: Standardized error parsing and custom error classes
- **Zod Integration**: Optional request/response validation using Zod schemas
- **Cookie Support**: Includes credentials for HttpOnly cookie-based authentication
- **Response Normalization**: Consistent handling of JSON and text responses

## Configuration

The HTTP client is configured with a base URL from environment variables:

```typescript
// Default configuration
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

To override the API URL, create a `.env.local` file:

```env
VITE_API_URL=https://api.yourapp.com
```

## Basic Usage

### Importing the Client

```typescript
import {httpClient} from '@/lib/http-client';
```

### Making Requests

#### GET Request

```typescript
interface User {
  id: string;
  email: string;
  fullName: string;
}

const user = await httpClient.get<User>('/auth/me');
```

#### POST Request

```typescript
interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

const response = await httpClient.post<LoginRequest, LoginResponse>('/auth/login', {
  username: 'demo@example.com',
  password: 'password',
});
```

#### PUT Request

```typescript
const updatedUser = await httpClient.put<UpdateUserDTO, User>('/users/123', {
  fullName: 'New Name',
});
```

#### PATCH Request

```typescript
const partialUpdate = await httpClient.patch<Partial<User>, User>('/users/123', {
  email: 'newemail@example.com',
});
```

#### DELETE Request

```typescript
const result = await httpClient.delete<{success: boolean}>('/users/123');
```

## Type-Safe Requests with Zod Validation

For maximum type safety, use the `request()` method with Zod schemas:

```typescript
import {loginSchema} from '@acme/contracts';
import {z} from 'zod/v4';

const responseSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    fullName: z.string(),
  }),
});

type LoginResponse = z.infer<typeof responseSchema>;

const response = await httpClient.request<LoginDTO, LoginResponse>('/auth/login', {
  method: 'POST',
  data: {
    username: 'demo',
    password: 'password',
  },
  requestSchema: loginSchema,
  responseSchema: responseSchema,
});
```

This approach provides:

- **Request Validation**: Data is validated before sending
- **Response Validation**: Response is validated and parsed
- **Type Safety**: Full TypeScript inference from Zod schemas

## Error Handling

### HttpClientError

All API errors are thrown as `HttpClientError` instances:

```typescript
import {HttpClientError} from '@/lib/http-client';

try {
  await httpClient.post('/auth/login', credentials);
} catch (error) {
  if (error instanceof HttpClientError) {
    console.error('Status:', error.statusCode);
    console.error('Message:', error.message);

    // Field-specific errors (e.g., validation errors)
    if (error.errors) {
      error.errors.forEach((err) => {
        console.error(`${err.path}: ${err.message}`);
      });
    }
  }
}
```

### Using with TanStack Query

The HTTP client integrates seamlessly with TanStack Query:

```typescript
import {useQuery} from '@tanstack/react-query';
import {httpClient} from '@/lib/http-client';

export const useGetUser = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => httpClient.get<User>(`/users/${userId}`),
  });
};
```

For mutations:

```typescript
import {useMutation} from '@tanstack/react-query';
import {httpClient} from '@/lib/http-client';

export const useUpdateUser = () => {
  return useMutation({
    mutationFn: (data: UpdateUserDTO) => httpClient.put<UpdateUserDTO, User>('/users/me', data),
    onSuccess: () => {
      // Invalidate and refetch queries
    },
    onError: (error) => {
      if (error instanceof HttpClientError) {
        // Handle error
      }
    },
  });
};
```

## Custom Headers

You can pass custom headers to any request:

```typescript
const response = await httpClient.get<Data>('/api/data', {
  headers: {
    'X-Custom-Header': 'value',
  },
});
```

## API Module Pattern

Organize API calls in dedicated modules under `src/modules/api/`:

```typescript
// src/modules/api/user-api.ts
import {httpClient} from '@/lib/http-client';

export interface User {
  id: string;
  email: string;
  fullName: string;
}

export const getUser = (userId: string): Promise<User> => {
  return httpClient.get<User>(`/users/${userId}`);
};

export const updateUser = (userId: string, data: Partial<User>): Promise<User> => {
  return httpClient.patch<Partial<User>, User>(`/users/${userId}`, data);
};
```

Then create custom hooks that use these API functions:

```typescript
// src/modules/user/hooks/use-get-user-query.ts
import {useQuery} from '@tanstack/react-query';
import {getUser} from '@/modules/api/user-api';

export const useGetUserQuery = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
  });
};
```

## Best Practices

1. **Always use shared types**: Import types from `@acme/contracts` when available
2. **Validate with Zod**: Use Zod schemas for request/response validation
3. **Centralize API calls**: Keep all API functions in `src/modules/api/`
4. **Create custom hooks**: Wrap API calls in TanStack Query hooks
5. **Handle errors gracefully**: Always handle `HttpClientError` in mutations
6. **Use query keys**: Centralize query keys for cache management

## Example: Complete Feature Implementation

```typescript
// 1. API module (src/modules/api/onboarding-api.ts)
import {OnboardingDTO} from '@acme/contracts';
import {httpClient} from '@/lib/http-client';

export interface CreateAccountResponse {
  success: boolean;
  userId: string;
}

export const createAccount = async (
  data: OnboardingDTO,
): Promise<CreateAccountResponse> => {
  return httpClient.post<OnboardingDTO, CreateAccountResponse>(
    '/auth/register',
    data,
  );
};

// 2. Custom hook (src/modules/onboarding/hooks/use-create-account-mutation.ts)
import {useMutation} from '@tanstack/react-query';
import {createAccount} from '@/modules/api/onboarding-api';

export const useCreateAccountMutation = () => {
  return useMutation({
    mutationFn: createAccount,
    onError: (error) => {
      if (error instanceof HttpClientError) {
        // Show toast notification with error message
      }
    },
  });
};

// 3. Component usage
import {useCreateAccountMutation} from './hooks/use-create-account-mutation';

function OnboardingForm() {
  const mutation = useCreateAccountMutation();

  const handleSubmit = (data: OnboardingDTO) => {
    mutation.mutate(data, {
      onSuccess: () => {
        // Navigate to success page
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## Related Documentation

- [MSW Setup](./msw-setup.md) - API mocking for development and testing
- [TanStack Query Patterns](../../docs/tanstack-query.md) - Query and mutation patterns
- [Shared Contracts](../../../packages/contracts/README.md) - Zod schemas and types
