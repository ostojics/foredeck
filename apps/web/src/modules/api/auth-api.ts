import type {LoginDTO, MeResponseDTO} from '@acme/contracts';
import httpClient from './http-client';

export interface LoginResponse {
  message: string;
}

export const login = (dto: LoginDTO) => {
  return httpClient.post('v1/auth/login', {json: dto}).json<LoginResponse>();
};

export const me = () => {
  return httpClient.get('v1/auth/me').json<MeResponseDTO>();
};

export const logout = () => {
  return httpClient.post('v1/auth/logout').json<{success: boolean}>();
};
