import {z} from 'zod/v4';

/**
 * Validates request data using a Zod schema and returns a typed result or error response
 */
export function validateRequest<T>(
  schema: z.Schema<T>,
  data: unknown,
): {success: true; data: T} | {success: false; errors: {path: string; message: string}[]} {
  const result = schema.safeParse(data);

  if (result.success) {
    return {success: true, data: result.data};
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const errorList: unknown[] = result.error.errors;

  const errors = errorList.map((err: unknown) => {
    const error = err as {path: (string | number)[]; message: string};
    return {
      path: error.path.join('.'),
      message: error.message,
    };
  });

  return {
    success: false,
    errors,
  };
}
