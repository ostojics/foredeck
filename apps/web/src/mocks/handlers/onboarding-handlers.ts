import {http, HttpResponse} from 'msw';
import {onboardingSchema} from '@acme/contracts';

const API_URL = 'http://localhost:3000/api';

export const onboardingHandlers = [
  // Create account / register endpoint
  http.post(`${API_URL}/auth/register`, async ({request}) => {
    try {
      const body: unknown = await request.json();

      // Validate request body with Zod schema
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const parseResult = onboardingSchema.safeParse(body);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!parseResult.success) {
        return HttpResponse.json(
          {
            message: 'Validation failed',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            errors: parseResult.error.errors.map((err) => ({
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              path: err.path.join('.'),
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              message: err.message,
            })),
          },
          {status: 400},
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const {email} = parseResult.data;

      // Check if email already exists (simple mock logic)
      if (email === 'existing@foredeck.app') {
        return HttpResponse.json(
          {
            message: 'User already exists',
            errors: [{path: 'email', message: 'This email is already registered'}],
          },
          {status: 409},
        );
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful registration
      return HttpResponse.json(
        {
          success: true,
          userId: `user-${Date.now()}`,
        },
        {
          status: 201,
          headers: {
            'Set-Cookie': 'session=mock-new-session-token; HttpOnly; Secure; SameSite=Strict',
          },
        },
      );
    } catch {
      return HttpResponse.json({message: 'An error occurred during registration'}, {status: 500});
    }
  }),
];
