import {http, HttpResponse} from 'msw';
import {onboardingSchema} from '@acme/contracts';
import {validateRequest} from '@/mocks/utils/validate-request';

const API_URL = 'http://localhost:3000/api';

export const onboardingHandlers = [
  // Create account / register endpoint
  http.post(`${API_URL}/auth/register`, async ({request}) => {
    try {
      const body: unknown = await request.json();

      // Validate request body with Zod schema
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const validation = validateRequest(onboardingSchema, body);

      if (!validation.success) {
        return HttpResponse.json(
          {
            message: 'Validation failed',
            errors: validation.errors,
          },
          {status: 400},
        );
      }

      const {email} = validation.data;

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
