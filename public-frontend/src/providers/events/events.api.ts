import axios, { AxiosInstance } from 'axios';
import { Event } from '@/src/domain/Event';
import { EventRepository } from '@/src/domain/EventRepository';

class EventsApi implements EventRepository {
  private http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: import.meta.env.VITE_BACKEND_API_URL,
    });
  }

  async getEventById(id: string) {
    try {
      const response = await this.http.get<{
        name: string;
        startDate: string;
        endDate: string;
      }>(`/events/${id}`);

      const { name, startDate, endDate } = response.data;

      return new Event(name, startDate, endDate);
    } catch (e) {
      throw new Error(`Failed to retrieve event with id ${id} : ${e}`);
    }
  }
}

export const eventsApi = new EventsApi();
