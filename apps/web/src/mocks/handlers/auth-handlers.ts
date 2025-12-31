import {http, HttpResponse} from 'msw';
import type {User} from '@/modules/api/auth-api';

const API_URL = 'http://localhost:3000/api';

// Mock user data
const mockUser: User = {
  id: '1',
  email: 'demo@foredeck.app',
  fullName: 'Demo User',
};

export const authHandlers = [
  // Login endpoint - happy path only
  http.post(`${API_URL}/auth/login`, () => {
    return HttpResponse.json(
      {user: mockUser},
      {
        status: 200,
        headers: {
          'Set-Cookie':
            'session=mock-session-token; HttpOnly; Secure; SameSite=Strict',
        },
      },
    );
  }),

  // Get current user endpoint - happy path only
  http.get(`${API_URL}/auth/me`, () => {
    return HttpResponse.json(mockUser, {status: 200});
  }),

  // Logout endpoint - happy path only
  http.post(`${API_URL}/auth/logout`, () => {
    return HttpResponse.json(
      {success: true},
      {
        status: 200,
        headers: {
          'Set-Cookie':
            'session=; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
        },
      },
    );
  }),
];

