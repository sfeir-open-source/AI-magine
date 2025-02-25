import { useEventsProvider } from '@/src/providers/events/useEventsProvider';
import { useMutation } from '@tanstack/react-query';
import { NewEventPromptRequestBody } from '@/src/domain/EventRepository';

type EventPromptMutationRequest = {
  eventId: string;
} & NewEventPromptRequestBody

export const useEventPromptMutation = () => {
  const eventsProvider = useEventsProvider();

  return useMutation({
    mutationFn: (payload: EventPromptMutationRequest) => {
      const { eventId, ...eventPrompt } = payload

      return eventsProvider.sendPromptForEvent(eventId, eventPrompt)
    }
  })
}