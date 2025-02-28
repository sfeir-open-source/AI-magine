import { useGetSfeirEvents } from '@/src/hooks/use-get-sfeir-events';
import { useServices } from '@/src/hooks/use-services';

export const SfeirEventsList = () => {
  const { sfeirEventsService } = useServices();
  const { sfeirEvents, isFetchingSfeirEvents, getSfeirEventsError } =
    useGetSfeirEvents({ service: sfeirEventsService });

  if (isFetchingSfeirEvents) {
    return <div>Loading...</div>;
  }

  if (getSfeirEventsError) {
    return <div>Error...</div>;
  }

  return <div>SfeirEventsList {sfeirEvents.length}</div>;
};
