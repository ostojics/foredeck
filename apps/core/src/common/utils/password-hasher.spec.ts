import {PasswordHasher} from './password-hasher';

describe('PasswordHasher', () => {
  const testPassword = 'SecurePassword123!';

  describe('hash', () => {
    it('should hash a password', async () => {
      const hash = await PasswordHasher.hash(testPassword);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).toContain('$argon2id$');
      expect(hash.length).toBeGreaterThan(50);
    });

    it('should generate different hashes for the same password', async () => {
      const hash1 = await PasswordHasher.hash(testPassword);
      const hash2 = await PasswordHasher.hash(testPassword);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verify', () => {
    it('should verify a correct password', async () => {
      const hash = await PasswordHasher.hash(testPassword);
      const isValid = await PasswordHasher.verify(hash, testPassword);

      expect(isValid).toBe(true);
    });

    it('should reject an incorrect password', async () => {
      const hash = await PasswordHasher.hash(testPassword);
      const isValid = await PasswordHasher.verify(hash, 'WrongPassword');

      expect(isValid).toBe(false);
    });

    it('should handle invalid hash format gracefully', async () => {
      const isValid = await PasswordHasher.verify('invalid-hash', testPassword);

      expect(isValid).toBe(false);
    });
  });

  describe('needsRehash', () => {
    it('should indicate if hash needs rehashing', async () => {
      const hash = await PasswordHasher.hash(testPassword);
      const needsRehash = PasswordHasher.needsRehash(hash);

      expect(typeof needsRehash).toBe('boolean');
    });

    it('should return true for invalid hash format', () => {
      const needsRehash = PasswordHasher.needsRehash('invalid-hash');

      expect(needsRehash).toBe(true);
    });
  });

  describe('integration', () => {
    it('should complete a full hash-verify cycle', async () => {
      const plainPassword = 'TestPassword456!';

      const hash = await PasswordHasher.hash(plainPassword);
      expect(hash).toBeDefined();

      const isValidCorrect = await PasswordHasher.verify(hash, plainPassword);
      expect(isValidCorrect).toBe(true);

      const isValidWrong = await PasswordHasher.verify(hash, 'WrongPassword');
      expect(isValidWrong).toBe(false);
    });
  });
});
