import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/src/config/tanstack-query';
import { ReactRouterConfig } from '@/src/config/react-router';
import { EventsContext } from '@/src/providers/events/events.context';
import { eventsApi } from '@/src/providers/events/events.api';

export const App = () => {
  return (
    <EventsContext.Provider value={eventsApi}>
      <QueryClientProvider client={queryClient}>
        <ReactRouterConfig />
      </QueryClientProvider>
    </EventsContext.Provider>
  );
};
