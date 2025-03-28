import { useEventsProvider } from '@/src/providers/events/useEventsProvider';
import { useQuery } from '@tanstack/react-query';

export const useCountEventGenerationDone = (id?: string) => {
  const eventProvider = useEventsProvider();

  return useQuery({
    queryKey: ['countGenerationsDone', id],
    queryFn: () => {
      return eventProvider.getCountEventGenerationDone(id as string);
    },
    enabled: !!id,
  });
};
