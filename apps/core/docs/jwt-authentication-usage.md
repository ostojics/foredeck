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

### 1. Login Endpoint (Issue Tokens)

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

    // Generate token pair
    const tokens = await this.jwtService.generateTokenPair(userId, email, tenantId);

    // Set tokens as HttpOnly cookies
    this.jwtService.setTokenCookies(res, tokens);

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
    // user contains: sub (userId), email, tenantId, type
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
  this.jwtService.clearTokenCookies(res);
  return {message: 'Logout successful'};
}
```

### 4. Token Refresh

```typescript
@Post('refresh')
async refresh(@Res({passthrough: true}) res: Response) {
  // 1. Extract refresh token from cookies
  // 2. Verify refresh token
  // 3. Check if token is revoked (database lookup)
  // 4. Generate new token pair
  const userId = 'user-123';
  const email = 'user@example.com';
  const tenantId = 'tenant-456';

  const tokens = await this.jwtService.generateTokenPair(
    userId,
    email,
    tenantId
  );
  this.jwtService.setTokenCookies(res, tokens);

  return {message: 'Token refreshed'};
}
```

## JWT Payload Structure

```typescript
interface JwtPayload {
  sub: string; // User ID
  email: string; // User email
  tenantId: string; // Tenant ID for multi-tenancy
  type: 'access' | 'refresh'; // Token type
}
```

## Configuration

JWT configuration is managed in `src/config/jwt.config.ts`:

```typescript
// Environment variables:
JWT_SECRET=your-secret-key
JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d
```

## Cookie Configuration

Tokens are stored as HttpOnly cookies with the following settings:

- **httpOnly**: `true` - Prevents JavaScript access (XSS protection)
- **secure**: `true` in production - HTTPS only
- **sameSite**: `'lax'` - CSRF protection
- **path**: `'/'` - Available to all routes

### Cookie Names

- `access_token` - Short-lived access token (15 minutes)
- `refresh_token` - Long-lived refresh token (7 days)

## Security Best Practices

1. **Always use HTTPS in production** - Set `secure: true` for cookies
2. **Keep access tokens short-lived** - Default 15 minutes
3. **Store refresh tokens in database** - For revocation on logout
4. **Validate token type in guards** - Ensure access tokens aren't used as refresh tokens
5. **Implement token blacklist** - For immediate revocation
6. **Rate limit auth endpoints** - Prevent brute force attacks
7. **Use strong JWT secrets** - Generate with secure random generator
8. **Never expose tokens to JavaScript** - Always use HttpOnly cookies

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
- Token is not an access token type

## Token Revocation

For production, implement token revocation:

```typescript
// 1. Store refresh tokens in database with user association
// 2. On logout, delete the refresh token from database
// 3. On refresh, check if refresh token exists in database
// 4. Optionally implement token blacklist for immediate access token revocation
```

## Testing

When testing protected routes, you can mock the JWT service or use real tokens:

```typescript
const mockJwtService = {
  generateTokenPair: jest.fn(),
  verifyToken: jest.fn(),
  setTokenCookies: jest.fn(),
  clearTokenCookies: jest.fn(),
};
```

## Common Issues

### "No access token provided"

- Ensure cookies are being sent in requests
- Check cookie configuration (path, domain)
- Verify CORS settings allow credentials

### "Invalid or expired token"

- Token may have expired (15 min for access tokens)
- Use refresh endpoint to get new tokens
- Verify JWT_SECRET matches between environments

### Tokens not set in browser

- Ensure `@Res({passthrough: true})` is used
- Check browser cookie settings
- Verify domain and secure flags are correct
