import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {RouterProvider} from '@tanstack/react-router';
import './index.css';
import {router} from './router';
import {ThemeProvider} from '@/modules/theme/theme-context';
import {AuthProvider} from '@/modules/auth/auth-context';
import {useAuthContext} from '@/modules/auth/hooks/use-auth-context';
import {AppErrorBoundary} from './components/error-boundary/error-boundary';
import {MSW_ENABLED} from './common/constants/constants';
import {queryClient} from './modules/api/query-client';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function AppRouter() {
  const {isAuthenticated} = useAuthContext();

  return <RouterProvider router={router} context={{isAuthenticated}} />;
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

async function enableMocking() {
  if (!MSW_ENABLED) {
    return;
  }

  const {worker} = await import('./mocks/browser');

  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}

void enableMocking().then(() => {
  createRoot(rootElement).render(
    <StrictMode>
      <AppErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <AppRouter />
            </AuthProvider>
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
          </ThemeProvider>
        </QueryClientProvider>
      </AppErrorBoundary>
    </StrictMode>,
  );
});
