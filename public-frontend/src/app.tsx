import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/src/config/tanstack-query';
import { BrowserRouter } from 'react-router';
import { ReactRouterConfig } from '@/src/config/react-router';
import { I18nProvider } from '@/src/providers/i18n';

export const App = () => {
  return (
    <I18nProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ReactRouterConfig />
        </BrowserRouter>
      </QueryClientProvider>
    </I18nProvider>
  );
};
