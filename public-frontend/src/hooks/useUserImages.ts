import { useEventsProvider } from '@/src/providers/events/useEventsProvider';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { Image } from '@/src/domain/Image';

export const byDateSelector = (data: Image[]) => {
  return data.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const getUserImagesQueryKey = (eventId?: string, userId?: string) => [
  'events',
  eventId,
  'users',
  userId,
  'images',
];

type UseUserImagesOptions = { select?: (data: Image[]) => Image[] };

export const useUserImages = (
  userId: string,
  options?: UseUserImagesOptions
) => {
  const { eventId } = useParams<{ eventId: string }>();

  const eventsProvider = useEventsProvider();

  return useQuery<Image[]>({
    queryKey: getUserImagesQueryKey(eventId, userId),
    queryFn: () => {
      if (!eventId || !userId) return [];

      return eventsProvider.getImagesForUser(eventId, userId);
    },
    enabled: !!eventId && !!userId,
    select: options?.select,
  });
};
