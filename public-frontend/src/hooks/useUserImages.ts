import { useEventsProvider } from '@/src/providers/events/useEventsProvider';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { Image } from '@/src/domain/Image';

export const getUserImagesQueryKey = (eventId?: string, userId?: string) => [
  'events',
  eventId,
  'users',
  userId,
  'images',
];

export const useUserImages = (userId: string) => {
  const { eventId } = useParams<{ eventId: string }>();

  const eventsProvider = useEventsProvider();

  return useQuery<Image[]>({
    queryKey: getUserImagesQueryKey(eventId, userId),
    queryFn: () => {
      if (!eventId || !userId) return [];

      return eventsProvider.getImagesForUser(eventId, userId);
    },
    enabled: !!eventId && !!userId,
  });
};
