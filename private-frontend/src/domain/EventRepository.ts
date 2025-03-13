import { Event } from '@/src/domain/Event';

export interface EventRepository {
  getEventById(eventId: string): Promise<Event>;

  getAllEvents(): Promise<Event[]>;
}
