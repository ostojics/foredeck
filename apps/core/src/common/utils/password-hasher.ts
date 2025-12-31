import * as argon2 from 'argon2';

/**
 * Password hashing utilities using Argon2.
 * Argon2 is a modern password hashing algorithm that is resistant to GPU attacks.
 */
export class PasswordHasher {
  /**
   * Hash a password using Argon2.
   * Uses argon2id variant (hybrid of argon2i and argon2d) for balanced security.
   *
   * @param password - The plain text password to hash
   * @returns Promise resolving to the hashed password
   *
   * @example
   * ```typescript
   * const hashed = await PasswordHasher.hash('mySecurePassword123');
   * console.log(hashed); // $argon2id$v=19$m=65536,t=3,p=4$...
   * ```
   */
  static async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64 MiB
      timeCost: 3,
      parallelism: 4,
    });
  }

  /**
   * Verify a password against a hash.
   *
   * @param hash - The hashed password from the database
   * @param password - The plain text password to verify
   * @returns Promise resolving to true if the password matches, false otherwise
   *
   * @example
   * ```typescript
   * const isValid = await PasswordHasher.verify(storedHash, providedPassword);
   * if (isValid) {
   *   // Password is correct
   * }
   * ```
   */
  static async verify(hash: string, password: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch {
      // Invalid hash format or verification error
      return false;
    }
  }

  /**
   * Check if a hash needs to be rehashed (e.g., if security parameters changed).
   * This is useful for upgrading hashes when you increase security parameters.
   *
   * @param hash - The hashed password to check
   * @returns Promise resolving to true if the hash needs rehashing
   *
   * @example
   * ```typescript
   * if (await PasswordHasher.needsRehash(hash)) {
   *   const newHash = await PasswordHasher.hash(plainPassword);
   *   // Update hash in database
   * }
   * ```
   */
  static needsRehash(hash: string): boolean {
    try {
      return argon2.needsRehash(hash, {
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 4,
      });
    } catch {
      // Invalid hash format
      return true;
    }
  }
}
