import { useEventsProvider } from '@/src/providers/events/useEventsProvider';
import { useMutation } from '@tanstack/react-query';
import { CreateEventPromptRequest } from '@/src/domain/EventRepository';

export const useCreateEventPromptMutation = () => {
  const eventsProvider = useEventsProvider();

  return useMutation({
    mutationFn: (payload: CreateEventPromptRequest) => {
      return eventsProvider.sendPromptForEvent(payload);
    },
  });
};
