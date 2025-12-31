import {PipeTransform, Injectable, BadRequestException} from '@nestjs/common';
import {ZodSchema, ZodError} from 'zod';

/**
 * Custom validation pipe that uses Zod schemas for request validation.
 * Throws BadRequestException with detailed Zod error objects on validation failure.
 *
 * @example
 * ```typescript
 * // In controller:
 * @Post('login')
 * async login(@Body(new ZodValidationPipe(loginSchema)) body: LoginDTO) {
 *   // body is now validated and typed
 * }
 * ```
 */
@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: error.errors,
        });
      }
      throw new BadRequestException('Validation failed');
    }
  }
}
