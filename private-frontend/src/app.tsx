import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/src/config/tanstack-query';
import { BrowserRouter } from 'react-router';
import { ReactRouterConfig } from '@/src/config/react-router';
import { ServicesProvider } from '@/src/providers/services/services.provider';
import { FakeEventService } from '@/src/services/event/fake-event.service';

export const App = () => {
  return (
    <ServicesProvider eventsService={new FakeEventService()}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ReactRouterConfig />
        </BrowserRouter>
      </QueryClientProvider>
    </ServicesProvider>
  );
};
