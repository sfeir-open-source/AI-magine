import {
  pastEventsSelector,
  todayEventsSelector,
  upcomingEventsSelector,
  useEventList,
} from '@/src/hooks/useEventList';
import { EventsTable } from '@/src/components/events-table/events-table';
import { CalendarDays, History, PartyPopper } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { EventListHeader } from '@/src/components/event-list-header/event-list-header';

export const EventListPage = () => {
  const { data: todayEvents } = useEventList(todayEventsSelector);
  const { data: upcomingEvents } = useEventList(upcomingEventsSelector);
  const { data: pastEvents } = useEventList(pastEventsSelector);

  return (
    <>
      <EventListHeader />
      <Separator />
      <div className="flex flex-1 flex-col gap-4 p-4">
        {todayEvents && (
          <EventsTable
            events={todayEvents}
            title="Today's events"
            TitleIcon={PartyPopper}
          />
        )}
        {upcomingEvents && (
          <EventsTable
            events={upcomingEvents}
            title="Upcoming events"
            TitleIcon={CalendarDays}
          />
        )}
        {pastEvents && (
          <EventsTable
            events={pastEvents}
            title="Past events"
            TitleIcon={History}
          />
        )}
      </div>
    </>
  );
};
