import LoginForm from '../login-form/login-form';
import styles from './login-page.module.scss';

const LoginPage = () => {
  return (
    <main className={styles['login-page']}>
      <LoginForm />
    </main>
  );
};

export default LoginPage;
