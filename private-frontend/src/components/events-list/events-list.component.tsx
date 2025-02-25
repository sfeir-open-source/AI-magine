import { useGetEvents } from '@/src/hooks/use-get-events';
import { useServices } from '@/src/hooks/use-services';
import { EventsListItem } from '@/src/components/events-list/item';
import { SidebarMenu } from '@/components/ui/sidebar';
import {sortEvents} from "@/src/components/events-list/event-list.utils";



export const EventsList = () => {
  const { eventsService } = useServices();
  const { events, isFetchingEvents, getEventsError } = useGetEvents({
    service: eventsService,
  });

  if (isFetchingEvents) {
    return <div>Loading...</div>;
  }

  if (getEventsError) {
    return <div>Error...</div>;
  }

  return (
    <SidebarMenu>
      {sortEvents(events).map((event) => (
        <EventsListItem key={event.id} {...event} />
      ))}
    </SidebarMenu>
  );
};
