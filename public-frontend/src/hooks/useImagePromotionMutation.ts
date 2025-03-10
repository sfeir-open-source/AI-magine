import { useEventsProvider } from '@/src/providers/events/useEventsProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { getUserImagesQueryKey } from '@/src/hooks/useUserImages';
import { useUserId } from '@/src/hooks/useUserId';

export const useImagePromotionMutation = () => {
  const queryClient = useQueryClient();
  const { eventId } = useParams<{ eventId: string }>();
  const userId = useUserId();

  const eventsProvider = useEventsProvider();

  return useMutation({
    mutationFn: ({ imageId }: { imageId: string }) => {
      if (!eventId || !userId)
        throw new Error('No event id or user id provided');

      return eventsProvider.promoteUserImage(eventId, userId, imageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUserImagesQueryKey(eventId, userId as string),
      });
    },
  });
};
