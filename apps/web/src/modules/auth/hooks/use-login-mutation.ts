import {useMutation} from '@tanstack/react-query';
import {login} from '@/modules/api/auth-api';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: login,
  });
};
