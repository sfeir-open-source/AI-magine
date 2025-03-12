import { useEventsProvider } from '@/src/providers/events/useEventsProvider';
import { useParams } from 'react-router';
import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getUserImagesQueryKey } from '@/src/hooks/useUserImages';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export const useImageGenerationListener = (userId: string) => {
  const { t } = useTranslation();

  const { eventId } = useParams<{
    eventId: string;
  }>();

  const queryClient = useQueryClient();

  const eventsProvider = useEventsProvider();

  const [progress, setProgress] = useState<number>(0);

  const listen = useCallback(
    (promptId: string) => {
      let isDone = false;

      const onEvent = (event: MessageEvent<string>) => {
        if (isDone) return;

        const data = JSON.parse(event?.data ?? '{}');
        const totalSteps = 5;

        switch (data.type) {
          case 'image:generation-requested':
            setProgress(100 / totalSteps);
            break;
          case 'image:generation-done':
            setProgress((100 / totalSteps) * 2);
            break;
          case 'storage:save-requested':
            setProgress((100 / totalSteps) * 3);
            break;
          case 'storage:save-done':
            setProgress((100 / totalSteps) * 4);
            break;
          case 'done':
            isDone = true;
            setProgress(100);

            setTimeout(() => {
              queryClient.invalidateQueries({
                queryKey: getUserImagesQueryKey(eventId, userId),
              });

              toast.success(t('successfully-generated-image'));

              setProgress(0);
            }, 1000);
            break;
          case 'error':
            setProgress(0);
            isDone = true;
            toast.error(t('failed-to-generate-image'));
            break;
          default:
            console.warn(`Unhandled image generation event : ${data.type}`);
        }
      };

      setProgress(10);

      eventsProvider.listenForPromptGenerationEvent(
        eventId as string,
        promptId,
        onEvent
      );
    },
    [eventId, eventsProvider, queryClient, userId]
  );

  return {
    progress,
    listen,
  };
};
