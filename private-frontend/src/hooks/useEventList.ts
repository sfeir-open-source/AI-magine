import { useEventsProvider } from '@/src/providers/events/useEventsProvider';
import { useQuery } from '@tanstack/react-query';
import { Event } from '@/src/domain/Event';
import {
  isAfter,
  isBefore,
  isWithinInterval,
  parseISO,
  startOfDay,
} from 'date-fns';

export const upcomingEventsSelector = (events: Event[]) => {
  const today = new Date();

  return events.filter((event) => {
    const eventStartDate = parseISO(event.startDate);
    return isAfter(eventStartDate, today);
  });
};

export const pastEventsSelector = (events: Event[]) => {
  const today = startOfDay(new Date());

  return events.filter((event) => {
    const eventEndDate = parseISO(event.endDate);
    return isBefore(eventEndDate, today);
  });
};

export const todayEventsSelector = (events: Event[]) => {
  const today = new Date();

  return events.filter(({ startDate, endDate }) =>
    isWithinInterval(today, {
      start: parseISO(startDate),
      end: parseISO(endDate),
    })
  );
};

export const useEventList = (select?: (data: Event[]) => Event[]) => {
  const eventProvider = useEventsProvider();

  return useQuery({
    queryKey: ['events'],
    queryFn: () => {
      return eventProvider.getAllEvents();
    },
    select,
  });
};
