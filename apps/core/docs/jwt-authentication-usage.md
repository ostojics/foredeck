# JWT Authentication Usage Guide

The JWT module provides secure authentication using JSON Web Tokens with HttpOnly cookies.

## Overview

The JWT authentication system includes:

- **JwtService**: Token generation, validation, and cookie management
- **JwtAuthGuard**: Route protection with token validation
- **CurrentUser decorator**: Easy access to authenticated user data

## Installation

The JWT module is already configured in the application. To use it in a module:

```typescript
import {JwtModule} from './auth/jwt.module';

@Module({
  imports: [JwtModule],
  // ...
})
export class YourModule {}
```

## Basic Usage

### 1. Login Endpoint (Issue Token)

```typescript
import {Controller, Post, Body, Res} from '@nestjs/common';
import {Response} from 'express';
import {JwtService} from './auth/jwt.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}

  @Post('login')
  async login(@Body() body: {email: string; password: string}, @Res({passthrough: true}) res: Response) {
    // 1. Validate credentials
    // 2. Fetch user from database
    const userId = 'user-123';
    const email = body.email;
    const tenantId = 'tenant-456';

    // Generate token
    const token = await this.jwtService.generateToken(userId, email, tenantId);

    // Set token as HttpOnly cookie
    this.jwtService.setTokenCookie(res, token);

    return {message: 'Login successful'};
  }
}
```

### 2. Protected Routes

```typescript
import {Controller, Get, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from './auth/guards/jwt-auth.guard';
import {CurrentUser} from './auth/decorators/current-user.decorator';
import {JwtPayload} from './auth/jwt.service';

@Controller('users')
export class UserController {
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: JwtPayload) {
    // user contains: sub (userId), email, tenantId
    return {
      userId: user.sub,
      email: user.email,
      tenantId: user.tenantId,
    };
  }
}
```

### 3. Logout

```typescript
@Post('logout')
@UseGuards(JwtAuthGuard)
async logout(@Res({passthrough: true}) res: Response) {
  this.jwtService.clearTokenCookie(res);
  return {message: 'Logout successful'};
}
```

## JWT Payload Structure

```typescript
interface JwtPayload {
  sub: string; // User ID
  email: string; // User email
  tenantId: string; // Tenant ID for multi-tenancy
}
```

## Configuration

JWT configuration is managed in `src/config/jwt.config.ts`:

```typescript
// Environment variables:
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
```

## Cookie Configuration

The token is stored as an HttpOnly cookie with the following settings:

- **httpOnly**: `true` - Prevents JavaScript access (XSS protection)
- **secure**: `true` in production - HTTPS only
- **sameSite**: `'lax'` - CSRF protection
- **path**: `'/'` - Available to all routes

### Cookie Name

- `access_token` - JWT access token (15 minutes by default)

## Security Best Practices

1. **Always use HTTPS in production** - Set `secure: true` for cookies
2. **Keep tokens short-lived** - Default 15 minutes
3. **Rate limit auth endpoints** - Prevent brute force attacks
4. **Use strong JWT secrets** - Generate with secure random generator
5. **Never expose tokens to JavaScript** - Always use HttpOnly cookies

## Swagger Documentation

Add authentication documentation to your endpoints:

```typescript
import {ApiCookieAuth, ApiResponse} from '@nestjs/swagger';

@Get('profile')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth('access_token')
@ApiResponse({status: 200, description: 'Profile retrieved'})
@ApiResponse({status: 401, description: 'Unauthorized'})
async getProfile(@CurrentUser() user: JwtPayload) {
  // ...
}
```

## Error Handling

The `JwtAuthGuard` throws `UnauthorizedException` in these cases:

- No access token provided
- Invalid token signature
- Expired token

## Testing

When testing protected routes, you can mock the JWT service:

```typescript
const mockJwtService = {
  generateToken: jest.fn(),
  verifyToken: jest.fn(),
  setTokenCookie: jest.fn(),
  clearTokenCookie: jest.fn(),
};
```

## Common Issues

### "No access token provided"

- Ensure cookies are being sent in requests
- Check cookie configuration (path, domain)
- Verify CORS settings allow credentials

### "Invalid or expired token"

- Token may have expired (15 min by default)
- User needs to log in again
- Verify JWT_SECRET matches between environments

### Tokens not set in browser

- Ensure `@Res({passthrough: true})` is used
- Check browser cookie settings
- Verify domain and secure flags are correct
