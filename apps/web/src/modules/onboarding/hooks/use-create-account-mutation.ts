import {useMutation} from '@tanstack/react-query';
import {createAccount} from '@/modules/api/onboarding-api';

export const useCreateAccountMutation = () => {
  return useMutation({
    mutationFn: createAccount,
  });
};
