import {ErrorBoundary, FallbackProps} from 'react-error-boundary';

function ErrorFallback({error, resetErrorBoundary}: FallbackProps) {
  return (
    <div role="alert" style={{padding: 'var(--spacing-lg)'}}>
      <h2>Something went wrong:</h2>
      <pre style={{color: 'red'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

export function AppErrorBoundary({children}: AppErrorBoundaryProps) {
  return <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>;
}
