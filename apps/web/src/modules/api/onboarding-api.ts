import {OnboardingDTO} from '@acme/contracts';
import {httpClient} from '@/lib/http-client';

export interface CreateAccountResponse {
  success: boolean;
  userId: string;
}

export const createAccount = async (data: OnboardingDTO): Promise<CreateAccountResponse> => {
  return httpClient.post<OnboardingDTO, CreateAccountResponse>('/auth/register', data);
};
