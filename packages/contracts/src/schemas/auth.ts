import {z} from 'zod/v4';

export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginDTO = z.infer<typeof loginSchema>;

export const meResponseSchema = z.object({
  userId: z.uuid(),
  email: z.email(),
  fullName: z.string(),
  tenant: z.object({
    name: z.string(),
  }),
});

export type MeResponseDTO = z.infer<typeof meResponseSchema>;
