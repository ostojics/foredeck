import {http, HttpResponse} from 'msw';

const API_URL = 'http://localhost:3000/api';

export const onboardingHandlers = [
  // Create account / register endpoint - happy path only
  http.post(`${API_URL}/v1/auth/register`, () => {
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
  }),
];
