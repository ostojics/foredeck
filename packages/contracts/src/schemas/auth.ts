import {z} from 'zod/v4';

export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginDTO = z.infer<typeof loginSchema>;

export const userSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string(),
  tenant: z.object({
    name: z.string(),
  }),
});

export type UserDTO = z.infer<typeof userSchema>;
