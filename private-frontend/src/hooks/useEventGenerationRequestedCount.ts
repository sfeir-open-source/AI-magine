import { useEventsProvider } from '@/src/providers/events/useEventsProvider';
import { useQuery } from '@tanstack/react-query';

export const useCountEventGenerationRequested = (id?: string) => {
  const eventProvider = useEventsProvider();

  return useQuery({
    queryKey: ['countGenerationRequests', id],
    queryFn: () => {
      return eventProvider.getCountEventGenerationRequested(id as string);
    },
    enabled: !!id,
  });
};
