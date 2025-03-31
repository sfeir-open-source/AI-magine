import { useEventsProvider } from '@/src/providers/events/useEventsProvider';
import { useQuery } from '@tanstack/react-query';

export const useCountEventGenerationError = (id?: string) => {
  const eventProvider = useEventsProvider();

  return useQuery({
    queryKey: ['countGenerationErrors', id],
    queryFn: () => {
      return eventProvider.getCountEventGenerationError(id as string);
    },
    enabled: !!id,
  });
};
