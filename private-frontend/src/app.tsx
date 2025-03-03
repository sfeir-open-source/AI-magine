import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/src/config/tanstack-query';
import { BrowserRouter } from 'react-router';
import { ReactRouterConfig } from '@/src/config/react-router';

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ReactRouterConfig />
      </BrowserRouter>
    </QueryClientProvider>
  );
};
