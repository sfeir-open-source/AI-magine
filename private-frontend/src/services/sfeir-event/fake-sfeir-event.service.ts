import { SfeirEventService } from '@/src/services/sfeir-event/sfeir-event.service';
import { CreateSfeirEventDto } from './dtos';
import { SfeirEvent } from './entities';

export class FakeSfeirEventService implements SfeirEventService {
  private events: SfeirEvent[] = [];

  getSfeirEvents(): Promise<SfeirEvent[]> {
    return Promise.resolve(this.events);
  }
  createSfeirEvent(event: CreateSfeirEventDto): Promise<SfeirEvent> {
    const newEvent: SfeirEvent = {
      id: Date.now().toString(),
      name: event.name,
      startDate: new Date(event.startDateTs),
      endDate: new Date(event.endDateTs),
    };
    this.events.push(newEvent);
    return Promise.resolve(newEvent);
  }
  deleteSfeirEvent(id: string): Promise<SfeirEvent> {
    const event = this.events.find((e) => e.id === id);
    if (!event) {
      return Promise.reject(new Error('Event not found'));
    }
    this.events = this.events.filter((e) => e.id !== id);
    return Promise.resolve(event);
  }
}
