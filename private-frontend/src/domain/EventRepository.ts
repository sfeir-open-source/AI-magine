import { Event } from '@/src/domain/Event';

export type CreateEventPayload = {
  name: string;
  startDateTimestamp: number;
  endDateTimestamp: number;
};

export type PromotedImage = {
  id: string;
  prompt: string;
  url: string;
  author: string;
};

export interface EventRepository {
  getEventById(eventId: string): Promise<Event>;

  getAllEvents(): Promise<Event[]>;

  createEvent(payload: CreateEventPayload): Promise<Event>;

  getPromotedImagesForEvent(eventId: string): Promise<PromotedImage[]>;
}
