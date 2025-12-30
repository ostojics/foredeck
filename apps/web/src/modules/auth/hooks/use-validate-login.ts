import {useForm} from 'react-hook-form';
import {LoginDTO, loginSchema} from '@acme/contracts';
import {standardSchemaResolver} from '@hookform/resolvers/standard-schema';

export const useValidateLogin = () => {
  return useForm<LoginDTO>({
    resolver: standardSchemaResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
};
