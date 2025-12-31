import {z} from 'zod/v4';

export const onboardingSchema = z
  .object({
    companyName: z.string().min(1, 'Company name is required'),
    companyUrl: z.url('Invalid URL').optional().or(z.literal('')),
    fullName: z.string().min(1, 'Full name is required'),
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type OnboardingDTO = z.infer<typeof onboardingSchema>;
