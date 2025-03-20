import { useEventsProvider } from '@/src/providers/events/useEventsProvider';
import { useQuery } from '@tanstack/react-query';

export const useEventSelectedImages = (eventId: string) => {
  const eventsProvider = useEventsProvider();

  return useQuery({
    queryKey: ['events', eventId, 'selected-images'],
    queryFn: () => {
      return eventsProvider.getPromotedImagesForEvent(eventId);
    },
  });
};
