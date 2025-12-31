import {BadRequestException} from '@nestjs/common';
import {ZodValidationPipe} from './zod-validation.pipe';
import {z} from 'zod';

describe('ZodValidationPipe', () => {
  const testSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    email: z.string().email('Invalid email'),
  });

  let pipe: ZodValidationPipe;

  beforeEach(() => {
    pipe = new ZodValidationPipe(testSchema);
  });

  it('should pass validation with valid data', () => {
    const validData = {
      username: 'testuser',
      email: 'test@example.com',
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = pipe.transform(validData);
    expect(result).toEqual(validData);
  });

  it('should throw BadRequestException with Zod errors for invalid data', () => {
    const invalidData = {
      username: '',
      email: 'invalid-email',
    };

    try {
      pipe.transform(invalidData);
      fail('Should have thrown BadRequestException');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);

      const response = (error as BadRequestException).getResponse() as {message: string; errors: unknown[]};
      expect(response.message).toBe('Validation failed');
      expect(response.errors).toBeDefined();
      expect(Array.isArray(response.errors)).toBe(true);
    }
  });

  it('should throw BadRequestException for completely invalid input', () => {
    const invalidData = null;

    try {
      pipe.transform(invalidData);
      fail('Should have thrown BadRequestException');
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });
});
