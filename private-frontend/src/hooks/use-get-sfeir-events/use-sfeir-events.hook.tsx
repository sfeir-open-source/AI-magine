import { useQuery } from '@tanstack/react-query';
import {
  UseGetSfeirEventsOptions,
  UseGetSfeirEventsResponse,
} from '@/src/hooks/use-get-sfeir-events/use-sfeir-events.types';

export const useGetSfeirEvents = (
  options: UseGetSfeirEventsOptions
): UseGetSfeirEventsResponse => {
  const { data, error, isFetching } = useQuery({
    queryKey: ['sfeir-events'],
    queryFn: () => options.service.getSfeirEvents(),
  });
  return {
    sfeirEvents: data || [],
    getSfeirEventsError: error,
    isFetchingSfeirEvents: isFetching,
  };
};
