import { useEventsProvider } from '@/src/providers/events/useEventsProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { getUserImagesQueryKey } from '@/src/hooks/useUserImages';

export const useImagePromotionMutation = () => {
  const queryClient = useQueryClient();
  const { eventId, userId } = useParams<{ eventId: string; userId: string }>();

  const eventsProvider = useEventsProvider();

  return useMutation({
    mutationFn: ({ imageId }: { imageId: string }) => {
      if (!eventId || !userId)
        throw new Error('No event id or user id provided');

      return eventsProvider.promoteUserImage(eventId, userId, imageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUserImagesQueryKey(eventId, userId),
      });
    },
  });
};
