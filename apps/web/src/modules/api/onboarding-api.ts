import type {OnboardingDTO} from '@acme/contracts';
import httpClient from './http-client';

export interface CreateAccountResponse {
  success: boolean;
  userId: string;
  tenantId: string;
}

export const createAccount = (dto: OnboardingDTO) => {
  return httpClient.post('v1/onboarding', {json: dto}).json<CreateAccountResponse>();
};
