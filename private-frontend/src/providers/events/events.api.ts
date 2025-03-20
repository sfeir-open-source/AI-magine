import axios, { AxiosInstance } from 'axios';
import { Event } from '@/src/domain/Event';
import {
  CreateEventPayload,
  EventRepository,
  PromotedImage,
} from '@/src/domain/EventRepository';

type ApiEvent = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
};

class EventsApi implements EventRepository {
  private http: AxiosInstance;
  private baseURL = import.meta.env.VITE_BACKEND_API_URL;

  constructor() {
    this.http = axios.create({
      baseURL: this.baseURL,
    });
  }

  async getEventById(eventId: string) {
    try {
      const response = await this.http.get<ApiEvent>(`/events/${eventId}`);

      const { id, name, startDate, endDate } = response.data;

      return new Event(id, name, startDate, endDate);
    } catch (e) {
      throw new Error(
        `Failed to retrieve event with id ${eventId} : ${(e as Error).message}`
      );
    }
  }

  async getAllEvents() {
    try {
      const response = await this.http.get<ApiEvent[]>(`/events`);

      return response.data.map(
        ({ id, name, startDate, endDate }) =>
          new Event(id, name, startDate, endDate)
      );
    } catch (e) {
      throw new Error(`Failed to retrieve events : ${(e as Error).message}`);
    }
  }

  async createEvent(payload: CreateEventPayload) {
    try {
      const response = await this.http.post<ApiEvent>(`/events`, payload);

      const { id, name, startDate, endDate } = response.data;

      return new Event(id, name, startDate, endDate);
    } catch (e) {
      throw new Error(`Failed to create event : ${(e as Error).message}`);
    }
  }

  async getPromotedImagesForEvent(eventId: string) {
    try {
      const response = await this.http.get<PromotedImage[]>(
        `/events/${eventId}/images/promoted`
      );

      return response.data;
    } catch {
      throw new Error('Failed to get promoted images for event');
    }
  }
}

export const eventsApi = new EventsApi();
