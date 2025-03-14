import { useUsersProvider } from '@/src/providers/users/useUsersProvider';
import { useQuery } from '@tanstack/react-query';
import { useUserId } from '@/src/hooks/useUserId';
import { useParams } from 'react-router';

export const getUseRemainingPromptsCountQueryKey = (
  userId: string,
  eventId: string
) => ['users', userId, 'events', eventId, 'remaining-prompts'];

export const useRemainingPromptsCount = () => {
  const usersProvider = useUsersProvider();

  const userId = useUserId();

  const { eventId } = useParams<{ eventId: string }>();

  return useQuery({
    queryKey: getUseRemainingPromptsCountQueryKey(userId ?? '', eventId ?? ''),
    queryFn: () => {
      if (!eventId || !userId) return 0;

      return usersProvider.getRemainingPromptsCountForUserAndEvent(
        userId,
        eventId
      );
    },
    enabled: !!userId && !!eventId,
  });
};
