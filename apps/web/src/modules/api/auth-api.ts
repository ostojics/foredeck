import type {LoginDTO} from '@acme/contracts';
import httpClient from './http-client';

export interface User {
  id: string;
  email: string;
  fullName: string;
}

export interface LoginResponse {
  user: User;
}

export const login = (dto: LoginDTO) => {
  return httpClient.post('v1/auth/login', {json: dto}).json<LoginResponse>();
};

export const me = () => {
  return httpClient.get('v1/auth/me').json<User>();
};

export const logout = () => {
  return httpClient.post('v1/auth/logout').json<{success: boolean}>();
};
