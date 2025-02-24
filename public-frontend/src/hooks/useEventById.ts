import { useEventsProvider } from '@/src/providers/events/useEventsProvider';
import { useQuery } from '@tanstack/react-query';

export const useEventById = (id?: string) => {
  const eventsProvider = useEventsProvider();

  return useQuery({
    queryKey: ['events', id],
    queryFn: ({ queryKey }) => {
      const eventId = queryKey[1] as string;

      return eventsProvider.getEventById(eventId);
    },
    enabled: !!id,
  });
};
