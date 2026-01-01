import {API_URL} from '@/common/constants/constants';
import {isPublicRoute} from '@/lib/utils/is-public-route';
import ky from 'ky';

const httpClient = ky.create({
  prefixUrl: API_URL,
  credentials: 'include',
});

const extended = httpClient.extend({
  hooks: {
    afterResponse: [
      (_request, _options, response) => {
        if (isPublicRoute(window.location.pathname)) return response;

        const {status} = response;

        if (status === 401 || status === 403) {
          window.location.href = '/login';
        }

        return response;
      },
    ],
  },
});

export default extended;
