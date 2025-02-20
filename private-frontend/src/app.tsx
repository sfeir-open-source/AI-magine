import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/src/config/tanstack-query';
import { BrowserRouter } from 'react-router';
import { ReactRouterConfig } from '@/src/config/react-router';
import { ServicesProvider } from '@/src/providers/services/services.provider';
import { FakeSfeirEventService } from '@/src/services/sfeir-event/fake-sfeir-event.service';
import { I18nProvider } from '@/src/providers/i18n';

export const App = () => {
  return (
    <I18nProvider>
      <ServicesProvider sfeirEventsService={new FakeSfeirEventService()}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ReactRouterConfig />
          </BrowserRouter>
        </QueryClientProvider>
      </ServicesProvider>
    </I18nProvider>
  );
};
