import { useContext } from 'react';
import { EventsContext } from '@/src/providers/events/events.context';

export const useEventsProvider = () => {
  const eventsProvider = useContext(EventsContext);

  if (!eventsProvider) {
    throw new Error('Missing events provider implementation in EventsContext');
  }

  return eventsProvider;
};
