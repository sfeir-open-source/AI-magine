import { CreateEventDto } from '@/src/services/event/event.dtos';
import { Event } from '@/src/services/event';

export interface EventService {
  getEvents(): Promise<Event[]>;

  createEvent(event: CreateEventDto): Promise<Event>;

  deleteEvent(id: string): Promise<Event>;
}
