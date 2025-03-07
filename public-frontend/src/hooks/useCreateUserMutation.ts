import { useMutation } from '@tanstack/react-query';
import { useEventsProvider } from '@/src/providers/events/useEventsProvider';
import { CreateEventUserRequest } from '@/src/domain/EventRepository';

export const useCreateUserMutation = () => {
  const eventsProvider = useEventsProvider();

  return useMutation({
    mutationFn: (payload: CreateEventUserRequest) => {
      return eventsProvider.createUserForEvent(payload);
    },
  });
};
