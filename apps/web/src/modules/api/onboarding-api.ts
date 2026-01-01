import type {OnboardingDTO} from '@acme/contracts';
import httpClient from './http-client';

export interface CreateAccountResponse {
  success: boolean;
  userId: string;
}

export const createAccount = (dto: OnboardingDTO) => {
  return httpClient.post('v1/auth/register', {json: dto}).json<CreateAccountResponse>();
};
