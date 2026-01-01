import {http, HttpResponse} from 'msw';
import type {User} from '@/modules/api/auth-api';
import {buildMockRoute} from '../utils/build-mock-route';

const mockUser: User = {
  id: '1',
  email: 'demo@foredeck.app',
  fullName: 'Demo User',
};

export const authHandlers = [
  http.post(buildMockRoute('/v1/auth/login'), () => {
    return HttpResponse.json({user: mockUser});
  }),

  http.get(buildMockRoute('/v1/auth/me'), () => {
    return HttpResponse.json(mockUser, {status: 200});
  }),

  http.post(buildMockRoute('/v1/auth/logout'), () => {
    return HttpResponse.json(
      {success: true},
      {
        status: 200,
      },
    );
  }),
];
