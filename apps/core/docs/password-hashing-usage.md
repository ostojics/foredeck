# Password Hashing with Argon2 Usage Guide

The `PasswordHasher` utility provides secure password hashing using the Argon2 algorithm.

## Overview

Argon2 is a modern, memory-hard password hashing algorithm that is resistant to:

- GPU attacks
- Side-channel attacks
- Time-memory trade-off attacks

The `PasswordHasher` uses the **Argon2id** variant, which combines the best features of Argon2i and Argon2d.

## Basic Usage

### Import

```typescript
import {PasswordHasher} from './common/utils/password-hasher';
```

### 1. Hash Password (Registration)

```typescript
@Post('register')
async register(@Body() body: {email: string; password: string}) {
  // Hash the password before storing
  const hashedPassword = await PasswordHasher.hash(body.password);

  // Store hashedPassword in database
  await this.userRepository.create({
    email: body.email,
    password: hashedPassword,
  });

  return {message: 'User registered successfully'};
}
```

### 2. Verify Password (Login)

```typescript
@Post('login')
async login(@Body() body: {email: string; password: string}) {
  // Fetch user from database
  const user = await this.userRepository.findByEmail(body.email);

  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // Verify password
  const isValid = await PasswordHasher.verify(
    user.password,
    body.password
  );

  if (!isValid) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // Password is correct, proceed with login
  return {message: 'Login successful'};
}
```

### 3. Change Password

```typescript
@Post('change-password')
@UseGuards(JwtAuthGuard)
async changePassword(
  @CurrentUser() user: JwtPayload,
  @Body() body: {oldPassword: string; newPassword: string}
) {
  // Fetch user from database
  const dbUser = await this.userRepository.findById(user.sub);

  // Verify old password
  const isValid = await PasswordHasher.verify(
    dbUser.password,
    body.oldPassword
  );

  if (!isValid) {
    throw new UnauthorizedException('Current password is incorrect');
  }

  // Hash new password
  const newHash = await PasswordHasher.hash(body.newPassword);

  // Update in database
  await this.userRepository.update(user.sub, {password: newHash});

  return {message: 'Password changed successfully'};
}
```

### 4. Rehash on Login (Security Upgrade)

When you increase security parameters, you can automatically upgrade hashes on login:

```typescript
@Post('login')
async loginWithRehash(@Body() body: {email: string; password: string}) {
  const user = await this.userRepository.findByEmail(body.email);

  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // Verify password
  const isValid = await PasswordHasher.verify(user.password, body.password);

  if (!isValid) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // Check if hash needs upgrading
  if (await PasswordHasher.needsRehash(user.password)) {
    const newHash = await PasswordHasher.hash(body.password);
    await this.userRepository.update(user.id, {password: newHash});
  }

  return {message: 'Login successful'};
}
```

## API Reference

### `PasswordHasher.hash(password: string): Promise<string>`

Hashes a password using Argon2id.

**Parameters:**

- `password` - The plain text password to hash

**Returns:**

- Promise resolving to the hashed password string

**Example:**

```typescript
const hash = await PasswordHasher.hash('mySecurePassword123');
// Returns: $argon2id$v=19$m=65536,t=3,p=4$...
```

### `PasswordHasher.verify(hash: string, password: string): Promise<boolean>`

Verifies a password against a hash.

**Parameters:**

- `hash` - The hashed password from the database
- `password` - The plain text password to verify

**Returns:**

- Promise resolving to `true` if password matches, `false` otherwise

**Example:**

```typescript
const isValid = await PasswordHasher.verify(storedHash, providedPassword);
if (isValid) {
  // Password is correct
}
```

**Note:** Returns `false` for invalid hash formats (doesn't throw).

### `PasswordHasher.needsRehash(hash: string): Promise<boolean>`

Checks if a hash needs to be rehashed with updated security parameters.

**Parameters:**

- `hash` - The hashed password to check

**Returns:**

- Promise resolving to `true` if rehashing is needed

**Example:**

```typescript
if (await PasswordHasher.needsRehash(hash)) {
  const newHash = await PasswordHasher.hash(plainPassword);
  // Update in database
}
```

**Note:** Returns `true` for invalid hash formats.

## Security Parameters

The `PasswordHasher` uses the following Argon2id parameters:

```typescript
{
  type: argon2.argon2id,    // Hybrid mode for balanced security
  memoryCost: 2^16,         // 64 MiB
  timeCost: 3,              // 3 iterations
  parallelism: 4            // 4 threads
}
```

These parameters provide strong security while maintaining reasonable performance.

### Adjusting Parameters

If you need to adjust parameters for your environment:

1. **Higher Security** (slower):

   ```typescript
   memoryCost: 2^17,  // 128 MiB
   timeCost: 4,
   parallelism: 8
   ```

2. **Lower Resources** (faster, less secure):
   ```typescript
   memoryCost: 2^15,  // 32 MiB
   timeCost: 2,
   parallelism: 2
   ```

## Best Practices

1. ✅ **Always hash passwords asynchronously** - Don't block the event loop
2. ✅ **Hash before storing** - Never store plain text passwords
3. ✅ **Never return hashes in API responses** - Keep them secret
4. ✅ **Use constant-time comparison** - `verify()` does this internally
5. ✅ **Implement password requirements** - Enforce on client side
6. ✅ **Rate limit auth endpoints** - Prevent brute force attacks
7. ✅ **Use HTTPS** - Protect passwords in transit
8. ✅ **Consider 2FA** - Add extra security layer
9. ✅ **Rehash on parameter upgrades** - Use `needsRehash()` on login
10. ✅ **Log auth failures** - Monitor for attacks

## Common Patterns

### User Registration Service

```typescript
@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async register(email: string, password: string) {
    // Check if user exists
    const exists = await this.userRepository.findByEmail(email);
    if (exists) {
      throw new ConflictException('User already exists');
    }

    // Hash password
    const hashedPassword = await PasswordHasher.hash(password);

    // Create user
    return this.userRepository.create({
      email,
      password: hashedPassword,
    });
  }
}
```

### Authentication Service

```typescript
@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return null;
    }

    const isValid = await PasswordHasher.verify(user.password, password);

    if (!isValid) {
      return null;
    }

    return user;
  }

  async login(user: User) {
    const tokens = await this.jwtService.generateTokenPair(user.id, user.email, user.tenantId);

    return tokens;
  }
}
```

## Error Handling

The `PasswordHasher` handles errors gracefully:

- `hash()` - Throws on invalid input
- `verify()` - Returns `false` for invalid hash formats (no throw)
- `needsRehash()` - Returns `true` for invalid hash formats (no throw)

Wrap in try-catch for production code:

```typescript
try {
  const hash = await PasswordHasher.hash(password);
} catch (error) {
  this.logger.error('Password hashing failed', error);
  throw new InternalServerErrorException('Registration failed');
}
```

## Testing

### Unit Tests

```typescript
describe('PasswordHasher', () => {
  it('should hash and verify password', async () => {
    const password = 'TestPassword123!';
    const hash = await PasswordHasher.hash(password);

    expect(hash).toContain('$argon2id$');

    const isValid = await PasswordHasher.verify(hash, password);
    expect(isValid).toBe(true);

    const isInvalid = await PasswordHasher.verify(hash, 'WrongPassword');
    expect(isInvalid).toBe(false);
  });
});
```

### Integration Tests

```typescript
describe('User Registration', () => {
  it('should hash password on registration', async () => {
    const response = await request(app.getHttpServer()).post('/users/register').send({
      email: 'test@example.com',
      password: 'SecurePass123!',
    });

    expect(response.status).toBe(201);

    const user = await userRepository.findByEmail('test@example.com');
    expect(user.password).toContain('$argon2id$');
    expect(user.password).not.toBe('SecurePass123!');
  });
});
```

## Performance Considerations

- **Hashing time**: ~50-200ms depending on parameters and hardware
- **Memory usage**: 64 MiB per hash operation (with default settings)
- **Async operations**: Never blocks the event loop
- **Parallelism**: Can utilize multiple CPU cores

For high-traffic applications, consider:

- Load balancing across multiple servers
- Caching authenticated sessions
- Rate limiting authentication attempts
- Using a job queue for bulk password operations

## Migration from Other Algorithms

If migrating from bcrypt or other algorithms:

1. Keep the old verification logic
2. On successful login with old hash, rehash with Argon2
3. Update the user's password hash in database
4. Eventually phase out old algorithm support

```typescript
async verifyAndUpgrade(user: User, password: string) {
  let isValid = false;

  // Try Argon2 first
  if (user.password.startsWith('$argon2')) {
    isValid = await PasswordHasher.verify(user.password, password);
  }
  // Fallback to bcrypt
  else if (user.password.startsWith('$2')) {
    isValid = await bcrypt.compare(password, user.password);

    // Upgrade to Argon2
    if (isValid) {
      const newHash = await PasswordHasher.hash(password);
      await this.userRepository.update(user.id, {password: newHash});
    }
  }

  return isValid;
}
```
