import {useNavigate} from '@tanstack/react-router';
import {useOnboardingForm} from '../../hooks/use-onboarding-form';
import {useCreateAccountMutation} from '../../hooks/use-create-account-mutation';
import {Input} from '@/components/input/input';
import {Button} from '@/components/button/button';
import {FormControl} from '@/components/form-control/form-control';
import {FormLabel} from '@/components/form-label/form-label';
import {FormErrorMessage} from '@/components/form-error-message/form-error-message';
import styles from './onboarding-form.module.scss';
import {OnboardingDTO} from '@acme/contracts';

export const OnboardingForm = () => {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useOnboardingForm();

  const navigate = useNavigate();
  const mutation = useCreateAccountMutation();

  const onSubmit = (data: OnboardingDTO) => {
    mutation.mutate(data, {
      onSuccess: () => {
        void navigate({to: '/onboarding/success'});
      },
      onError: () => {
        alert('Onboarding failed. Please try again.');
      },
    });
  };

  return (
    <form className={styles['onboarding-form']} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles['onboarding-form__section']}>
        <h3 className={styles['onboarding-form__title']}>Company Info</h3>
        <FormControl>
          <FormLabel htmlFor="companyName">Company Name</FormLabel>
          <Input id="companyName" {...register('companyName')} error={!!errors.companyName} placeholder="Acme Inc." />
          {errors.companyName && <FormErrorMessage>{errors.companyName.message}</FormErrorMessage>}
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="companyUrl">Company URL (Optional)</FormLabel>
          <Input
            id="companyUrl"
            {...register('companyUrl')}
            error={!!errors.companyUrl}
            placeholder="https://acme.com"
          />
          {errors.companyUrl && <FormErrorMessage>{errors.companyUrl.message}</FormErrorMessage>}
        </FormControl>
      </div>

      <div className={styles['onboarding-form__section']}>
        <h3 className={styles['onboarding-form__title']}>Account Info</h3>

        <FormControl>
          <FormLabel htmlFor="fullName">Full Name</FormLabel>
          <Input id="fullName" {...register('fullName')} error={!!errors.fullName} placeholder="John Doe" />
          {errors.fullName && <FormErrorMessage>{errors.fullName.message}</FormErrorMessage>}
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input id="email" type="email" {...register('email')} error={!!errors.email} placeholder="john@example.com" />
          {errors.email && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            id="password"
            type="password"
            {...register('password')}
            error={!!errors.password}
            placeholder="Min 8 characters"
          />
          {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
          <Input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            placeholder="Re-enter password"
          />
          {errors.confirmPassword && <FormErrorMessage>{errors.confirmPassword.message}</FormErrorMessage>}
        </FormControl>
      </div>

      <div className={styles['onboarding-form__actions']}>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Creating Account...' : 'Create Account'}
        </Button>
      </div>
    </form>
  );
};
