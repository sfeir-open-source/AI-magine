import { useQuery } from '@tanstack/react-query';
import {
  UseGetEventsOptions,
  UseGetEventsResponse,
} from '@/src/hooks/use-get-events/use-events.types';

export const useGetEvents = (
  options: UseGetEventsOptions
): UseGetEventsResponse => {
  const { data, error, isFetching } = useQuery({
    queryKey: ['events'],
    queryFn: () => options.service.getEvents(),
  });
  return {
    events: data || [],
    getEventsError: error,
    isFetchingEvents: isFetching,
  };
};
