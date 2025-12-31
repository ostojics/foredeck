# HTTP Client Documentation

## Overview

The HTTP client is a lightweight wrapper around [ky](https://github.com/sindresorhus/ky), providing a simple and clean interface for making API requests with automatic authentication handling and redirection for unauthorized requests.

## Features

- **Simple & Clean**: Minimal wrapper around ky library
- **Automatic Auth Handling**: Redirects to login on 401/403 for protected routes
- **Cookie Support**: Includes credentials for HttpOnly cookie-based authentication
- **Public Route Protection**: Skips auth redirects for public pages

## Configuration

The HTTP client is configured with a base URL from environment variables:

```typescript
const httpClient = ky.create({
  prefixUrl: import.meta.env.VITE_API_URL as string,
  credentials: 'include',
});
```

To override the API URL, create a `.env.local` file:

```env
VITE_API_URL=http://localhost:3000/api
```

## Public Routes

Public routes (login, register, onboarding) skip automatic auth redirects. These are configured in `src/lib/utils/index.ts`:

```typescript
const PUBLIC_PAGES = ['/login', '/register', '/onboarding'];

export const isPublicRoute = (path: string) => {
  return PUBLIC_PAGES.some((page) => path.startsWith(page));
};
```

## API Module Pattern

API functions are organized in `src/modules/api/` and use simple ky method calls.

### Creating API Functions

```typescript
// src/modules/api/auth-api.ts
import type {LoginDTO} from '@acme/contracts';
import httpClient from './http-client';

export interface User {
  id: string;
  email: string;
  fullName: string;
}

export interface LoginResponse {
  user: User;
}

export const login = (dto: LoginDTO) => {
  return httpClient.post('v1/auth/login', {json: dto}).json<LoginResponse>();
};

export const me = () => {
  return httpClient.get('v1/auth/me').json<User>();
};

export const logout = () => {
  return httpClient.post('v1/auth/logout').json<{success: boolean}>();
};
```

### Making Requests

#### GET Request

```typescript
export const getUser = (userId: string) => {
  return httpClient.get(`v1/users/${userId}`).json<User>();
};
```

#### POST Request

```typescript
export const createUser = (dto: CreateUserDTO) => {
  return httpClient.post('v1/users', {json: dto}).json<User>();
};
```

#### PUT Request

```typescript
export const updateUser = (userId: string, dto: UpdateUserDTO) => {
  return httpClient.put(`v1/users/${userId}`, {json: dto}).json<User>();
};
```

#### PATCH Request

```typescript
export const patchUser = (userId: string, dto: Partial<UpdateUserDTO>) => {
  return httpClient.patch(`v1/users/${userId}`, {json: dto}).json<User>();
};
```

#### DELETE Request

```typescript
export const deleteUser = (userId: string) => {
  return httpClient.delete(`v1/users/${userId}`).json<{success: boolean}>();
};
```

## Using with TanStack Query

The HTTP client integrates seamlessly with TanStack Query. Create custom hooks that use your API functions:

### Query Hook Example

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

### Mutation Hook Example

```typescript
// src/modules/user/hooks/use-update-user-mutation.ts
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {updateUser} from '@/modules/api/user-api';
import type {UpdateUserDTO} from '@acme/contracts';

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({userId, data}: {userId: string; data: UpdateUserDTO}) => updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['user']});
    },
  });
};
```

## Error Handling

Ky throws `HTTPError` for failed requests. Handle errors in your hooks:

```typescript
import {HTTPError} from 'ky';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: login,
    onError: async (error) => {
      if (error instanceof HTTPError) {
        const errorData = await error.response.json();
        console.error('Login failed:', errorData);
        // Show toast notification
      }
    },
  });
};
```

## Best Practices

1. **Organize by Feature**: Keep all API functions in `src/modules/api/`
2. **Use Type Imports**: Use `import type` for TypeScript types
3. **Centralize Query Keys**: Define query keys in a separate file
4. **Create Custom Hooks**: Wrap API calls in TanStack Query hooks
5. **Handle Errors**: Always handle errors in mutation hooks

## Example: Complete Feature Implementation

```typescript
// 1. API module (src/modules/api/vacation-api.ts)
import type {CreateVacationDTO} from '@acme/contracts';
import httpClient from './http-client';

export interface Vacation {
  id: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const createVacation = (dto: CreateVacationDTO) => {
  return httpClient
    .post('v1/vacations', {json: dto})
    .json<Vacation>();
};

export const getVacations = () => {
  return httpClient.get('v1/vacations').json<Vacation[]>();
};

// 2. Custom hook (src/modules/vacation/hooks/use-create-vacation-mutation.ts)
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {createVacation} from '@/modules/api/vacation-api';

export const useCreateVacationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVacation,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['vacations']});
    },
  });
};

// 3. Component usage
import {useCreateVacationMutation} from './hooks/use-create-vacation-mutation';

function VacationForm() {
  const mutation = useCreateVacationMutation();

  const handleSubmit = (data: CreateVacationDTO) => {
    mutation.mutate(data);
  };

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
}
```

## Related Documentation

- [MSW Setup](./msw-setup.md) - API mocking for development
- [Ky Documentation](https://github.com/sindresorhus/ky) - Full ky API reference
- [TanStack Query](https://tanstack.com/query) - Data fetching patterns
