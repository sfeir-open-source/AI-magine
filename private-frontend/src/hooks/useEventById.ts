import { useEventsProvider } from '@/src/providers/events/useEventsProvider';
import { useQuery } from '@tanstack/react-query';

export const useEventById = (id?: string) => {
  const eventProvider = useEventsProvider();

  return useQuery({
    queryKey: ['events', id],
    queryFn: () => {
      return eventProvider.getEventById(id as string);
    },
    enabled: !!id,
  });
};
