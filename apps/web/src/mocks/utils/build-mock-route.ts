import {API_URL} from '@/common/constants/constants';

export const buildMockRoute = (path: string): string => {
  return `${API_URL}${path}`;
};
