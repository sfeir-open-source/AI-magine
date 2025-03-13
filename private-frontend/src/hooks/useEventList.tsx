import { useEventsProvider } from '@/src/providers/events/useEventsProvider';
import { useQuery } from '@tanstack/react-query';
import { Event } from '@/src/domain/Event';
import {
  addMonths,
  endOfDay,
  isAfter,
  isBefore,
  parseISO,
  startOfDay,
} from 'date-fns';

export const upcomingEventsSelector = (events: Event[]) => {
  const today = new Date();
  const oneMonthFromNow = addMonths(today, 1);

  return events.filter((event) => {
    const eventDate = parseISO(event.startDate);
    return isAfter(eventDate, today) && isBefore(eventDate, oneMonthFromNow);
  });
};

export const pastEventsSelector = (events: Event[]) => {
  const today = startOfDay(new Date());

  return events.filter((event) => {
    const eventDate = parseISO(event.startDate);
    return isBefore(eventDate, today);
  });
};

export const todayEventsSelector = (events: Event[]) => {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  return events.filter((event) => {
    const eventDate = parseISO(event.startDate);
    return isAfter(eventDate, todayStart) && isBefore(eventDate, todayEnd);
  });
};

export const byDateSelector = (events: Event[]) => {
  return events.sort(
    (eventA, eventB) =>
      new Date(eventA.startDate).getTime() -
      new Date(eventB.startDate).getTime()
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
