import {Link, useNavigate} from '@tanstack/react-router';
import {useValidateLogin} from '@/modules/auth/hooks/use-validate-login';
import {useLoginMutation} from '@/modules/auth/hooks/use-login-mutation';
import {Input} from '@/components/input/input';
import {Button} from '@/components/button/button';
import {FormLabel} from '@/components/form-label/form-label';
import {FormControl} from '@/components/form-control/form-control';
import {FormErrorMessage} from '@/components/form-error-message/form-error-message';
import styles from './login-form.module.scss';
import {LoginDTO} from '@acme/contracts';

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useValidateLogin();

  const navigate = useNavigate();
  const mutation = useLoginMutation();

  const onSubmit = (data: LoginDTO) => {
    mutation.mutate(data, {
      onSuccess: () => {
        void navigate({to: '/home'});
      },
      onError: () => {
        alert('Login failed. Please check your credentials.');
      },
    });
  };

  return (
    <div className={styles['login-form']}>
      <div className={styles['login-form__header']}>
        <h1 className={styles['login-form__title']}>Log in</h1>
        <p className={styles['login-form__subtitle']}>Welcome back! Please enter your details.</p>
      </div>

      <form className={styles['login-form__form']} onSubmit={handleSubmit(onSubmit)}>
        <FormControl error={!!errors.email}>
          <FormLabel htmlFor="email" required>
            Email
          </FormLabel>
          <Input id="email" type="email" placeholder="Enter your email" error={!!errors.email} {...register('email')} />
          {errors.email && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
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

        <div className={styles['login-form__actions']}>
          <Link to="/login" className={styles['login-form__forgot-password']}>
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className={styles['login-form__submit']} disabled={mutation.isPending}>
          {mutation.isPending ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
