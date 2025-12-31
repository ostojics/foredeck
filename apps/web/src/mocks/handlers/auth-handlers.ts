import {http, HttpResponse} from 'msw';
import {loginSchema} from '@acme/contracts';
import type {User} from '@/modules/api/auth-api';

const API_URL = 'http://localhost:3000/api';

// Mock user data
const mockUser: User = {
  id: '1',
  email: 'demo@foredeck.app',
  fullName: 'Demo User',
};

export const authHandlers = [
  // Login endpoint
  http.post(`${API_URL}/auth/login`, async ({request}) => {
    try {
      const body: unknown = await request.json();

      // Validate request body with Zod schema
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const parseResult = loginSchema.safeParse(body);

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
      const {username, password} = parseResult.data;

      // Mock authentication logic
      if (username === 'demo' && password === 'password') {
        return HttpResponse.json(
          {user: mockUser},
          {
            status: 200,
            headers: {
              'Set-Cookie': 'session=mock-session-token; HttpOnly; Secure; SameSite=Strict',
            },
          },
        );
      }

      return HttpResponse.json({message: 'Invalid credentials'}, {status: 401});
    } catch {
      return HttpResponse.json({message: 'An error occurred during login'}, {status: 500});
    }
  }),

  // Get current user endpoint
  http.get(`${API_URL}/auth/me`, ({cookies}) => {
    // Check for session cookie
    if (cookies.session) {
      return HttpResponse.json(mockUser, {status: 200});
    }

    return HttpResponse.json({message: 'Unauthorized'}, {status: 401});
  }),

  // Logout endpoint
  http.post(`${API_URL}/auth/logout`, () => {
    return HttpResponse.json(
      {success: true},
      {
        status: 200,
        headers: {
          'Set-Cookie': 'session=; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
        },
      },
    );
  }),
];
