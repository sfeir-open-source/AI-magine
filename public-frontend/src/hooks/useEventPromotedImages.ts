import { useEventsProvider } from '@/src/providers/events/useEventsProvider';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

export const useEventPromotedImages = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const eventsProvider = useEventsProvider();

  return useQuery({
    queryKey: ['events', eventId, 'images'],
    queryFn: async () => {
      if (!eventId) return [];

      return await eventsProvider.getPromotedImagesForEvent(eventId);
    },
    enabled: !!eventId,
  });
};
