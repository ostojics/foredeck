# Zod Validation Pipe Usage Guide

The `ZodValidationPipe` provides type-safe request validation using Zod schemas from the shared contracts package.

## Basic Usage

### In Controllers

```typescript
import {Controller, Post, Body} from '@nestjs/common';
import {ZodValidationPipe} from './common/pipes/zod-validation.pipe';
import {loginSchema, LoginDTO} from '@acme/contracts';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body(new ZodValidationPipe(loginSchema)) body: LoginDTO) {
    // body is now validated and typed as LoginDTO
    return {
      message: 'Login successful',
      username: body.username,
    };
  }
}
```

## Features

- **Type Safety**: Uses Zod schemas to validate and type request bodies
- **Clear Errors**: Returns detailed Zod error objects in BadRequestException
- **Shared Schemas**: Works with schemas from `packages/contracts`
- **Automatic**: Validation happens before the controller method executes

## Error Response Format

When validation fails, the pipe returns a `BadRequestException` with the following structure:

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "Username is required",
      "path": ["username"]
    }
  ]
}
```

## Best Practices

1. **Define schemas in `packages/contracts`** for reusability across frontend and backend
2. **Use the same schema on both sides** to ensure consistency
3. **Add JSDoc comments** to schemas for better developer experience
4. **Use ApiBody and ApiResponse decorators** for Swagger documentation
5. **Type your controller parameters** with the inferred DTO type from the schema

## Example Schema Definition

```typescript
// packages/contracts/src/schemas/auth.ts
import {z} from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginDTO = z.infer<typeof loginSchema>;
```

## Integration with Swagger

```typescript
import {ApiBody, ApiResponse} from '@nestjs/swagger';

@Post('login')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      username: {type: 'string', example: 'johndoe'},
      password: {type: 'string', example: 'SecurePass123!'},
    },
  },
})
@ApiResponse({
  status: 400,
  description: 'Validation failed',
})
async login(@Body(new ZodValidationPipe(loginSchema)) body: LoginDTO) {
  // ...
}
```
