import { EventService } from '@/src/services/event/event.service';

export type ServiceContextType = {
  eventsService?: EventService;
};

export type ServiceProviderProps = {
  eventsService: EventService;
};
