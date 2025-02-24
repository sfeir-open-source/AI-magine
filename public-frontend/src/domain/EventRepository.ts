import {Event} from '@/src/domain/Event'

export interface EventRepository {
  getEventById(id: string): Promise<Event>;
}