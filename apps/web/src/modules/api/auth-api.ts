import {LoginDTO} from '@acme/contracts';
import {httpClient} from '@/lib/http-client';

export interface User {
  id: string;
  email: string;
  fullName: string;
}

export interface LoginResponse {
  user: User;
}

export const login = async (credentials: LoginDTO): Promise<LoginResponse> => {
  return httpClient.post<LoginDTO, LoginResponse>('/auth/login', credentials);
};

export const me = async (): Promise<User | null> => {
  try {
    return await httpClient.get<User>('/auth/me');
  } catch {
    return null;
  }
};
