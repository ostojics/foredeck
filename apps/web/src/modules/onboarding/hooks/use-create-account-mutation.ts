import {useMutation} from '@tanstack/react-query';
import {OnboardingDTO} from '@acme/contracts';

// Mock API function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createAccount = async (data: OnboardingDTO) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulate success
  return {success: true};
};

export const useCreateAccountMutation = () => {
  return useMutation({
    mutationFn: createAccount,
  });
};
