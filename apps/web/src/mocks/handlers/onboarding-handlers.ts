import {http, HttpResponse} from 'msw';
import {buildMockRoute} from '../utils/build-mock-route';

export const onboardingHandlers = [
  http.post(buildMockRoute('/v1/auth/register'), () => {
    return HttpResponse.json(
      {
        success: true,
        userId: `user-${Date.now()}`,
      },
      {
        status: 201,
      },
    );
  }),
];
