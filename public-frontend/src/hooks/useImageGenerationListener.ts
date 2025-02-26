import { useEventsProvider } from '@/src/providers/events/useEventsProvider';
import { useNavigate, useParams } from 'react-router';
import { useUserId } from '@/src/hooks/useUserId';
import { useCallback } from 'react';
import { toast } from 'sonner';
import i18n from '@/src/config/i18n';

export const useImageGenerationListener = () => {
  const { eventId, promptId } = useParams<{
    eventId: string;
    promptId: string;
  }>();

  const userId = useUserId();

  const navigate = useNavigate();

  const eventsProvider = useEventsProvider();

  if (!eventId || !promptId) {
    throw new Error(
      'Cannot listen for image generation event. Missing eventId or promptId.',
    );
  }

  if (userId) {
    const onEvent = useCallback(
      (event: MessageEvent<{ type: string }>) => {
        if (event.data.type === 'done') {
          navigate(`/events/${eventId}/users/${userId}/images`);
        }
      },
      [eventId, userId, navigate],
    );

    eventsProvider.listenForPromptGenerationEvent(eventId, promptId, onEvent);
  } else {
    toast.error(i18n.t('failed-authenticate-redirect'), {
      duration: 3000,
      onAutoClose: () => {
        navigate(`/events/${eventId}`);
      },
    });
  }

};
