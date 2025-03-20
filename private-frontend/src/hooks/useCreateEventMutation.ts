import { useMutation } from '@tanstack/react-query';
import { useEventsProvider } from '@/src/providers/events/useEventsProvider';
import { CreateEventPayload } from '@/src/domain/EventRepository';

export const useCreateEventMutation = () => {
  const eventsProvider = useEventsProvider();

  return useMutation({
    mutationFn: (payload: CreateEventPayload) => {
      return eventsProvider.createEvent(payload);
    },
  });
};
