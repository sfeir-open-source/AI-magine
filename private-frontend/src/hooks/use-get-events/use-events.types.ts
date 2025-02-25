import { EventService, Event } from 'src/services/event';

export type UseGetEventsOptions = {
  service: EventService;
};

export type UseGetEventsResponse = {
  events: Event[];
  getEventsError: Error | null;
  isFetchingEvents: boolean;
};
