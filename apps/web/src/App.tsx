import './App.css';
import {ThemeSwitch} from './components/theme-switch/theme-switch';
import LoginForm from './modules/auth/components/login-form';
import HomePage from './modules/home/components/home-page';

function App() {
  return (
    <section>
      <header style={{display: 'flex', justifyContent: 'flex-end', padding: 'var(--spacing-lg)'}}>
        <ThemeSwitch />
      </header>
      <HomePage />
      <h2>Form with shared validation package</h2>
      <LoginForm />
    </section>
  );
}

export default App;
