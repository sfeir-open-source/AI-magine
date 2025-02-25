import { EventService } from '@/src/services/event/event.service';
import { CreateEventDto } from '@/src/services/event/event.dtos';
import { Event } from '@/src/services/event';

export class FakeEventService implements EventService {
  private events: Event[] = [
    {
      id: 'today_event',
      name: 'Today event',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1, 0, 0, 0),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1, 0, 0, 0),
      isActive: true
    },
    {
      id: 'past_event',
      name: 'Past event',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 2, new Date().getDate() - 1, 0, 0, 0),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() - 2, new Date().getDate() + 1, 0, 0, 0),
      isActive: false
    },
    {
      id: 'future_event',
      name: 'Future event',
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() + 2, new Date().getDate() - 1, 0, 0, 0),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 2, new Date().getDate() + 1, 0, 0, 0),
      isActive: false
    },
  ];

  getEvents(): Promise<Event[]> {
    return Promise.resolve(this.events);
  }

  createEvent(event: CreateEventDto): Promise<Event> {
    const newEvent: Event = {
      id: Date.now().toString(),
      name: event.name,
      startDate: new Date(event.startDateTs),
      endDate: new Date(event.endDateTs),
      isActive: event.startDateTs < Date.now() && event.endDateTs >= Date.now()
    };
    this.events.push(newEvent);
    return Promise.resolve(newEvent);
  }

  deleteEvent(id: string): Promise<Event> {
    const event = this.events.find((e) => e.id === id);
    if (!event) {
      return Promise.reject(new Error('Event not found'));
    }
    this.events = this.events.filter((e) => e.id !== id);
    return Promise.resolve(event);
  }
}
