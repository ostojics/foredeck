import {useValidateLogin} from '@/modules/auth/hooks/use-validate-login';
import {Input} from '@/components/input/input';
import {Button} from '@/components/button/button';
import {FormLabel} from '@/components/form-label/form-label';
import {FormControl} from '@/components/form-control/form-control';
import {FormErrorMessage} from '@/components/form-error-message/form-error-message';

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useValidateLogin();

  return (
    <section>
      {/* eslint-disable-next-line no-console */}
      <form onSubmit={handleSubmit(() => console.log('submit'))}>
        <FormControl error={!!errors.username}>
          <FormLabel htmlFor="username" required>
            Username
          </FormLabel>
          <Input id="username" placeholder="Enter your username" error={!!errors.username} {...register('username')} />
          {errors.username && <FormErrorMessage>{errors.username.message}</FormErrorMessage>}
        </FormControl>

        <FormControl error={!!errors.password}>
          <FormLabel htmlFor="password" required>
            Password
          </FormLabel>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            error={!!errors.password}
            {...register('password')}
          />
          {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
        </FormControl>

        <Button type="submit">Login</Button>
      </form>
    </section>
  );
};

export default LoginPage;
