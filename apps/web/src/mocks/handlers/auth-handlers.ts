import {http, HttpResponse} from 'msw';
import type {MeResponseDTO} from '@acme/contracts';
import {buildMockRoute} from '../utils/build-mock-route';

const mockUser: MeResponseDTO = {
  userId: '1',
  email: 'demo@foredeck.app',
  fullName: 'Demo User',
  tenant: {
    name: 'Demo Tenant',
  },
};

export const authHandlers = [
  http.post(buildMockRoute('/v1/auth/login'), () => {
    return HttpResponse.json({message: 'Login successful'});
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
