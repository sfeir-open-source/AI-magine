import { SfeirEvent } from '@/core/domain/sfeir-event/sfeir-event';
import { CreateSfeirEventDto } from '@/core/application/sfeir-event/dto/create-sfeir-event.dto';
import { User } from '@/core/domain/user/user';

export interface SfeirEventService {
  getSfeirEvents(): Promise<SfeirEvent[]>;

  getSfeirEvent(id: string): Promise<SfeirEvent | undefined>;

  createSfeirEvent(
    createSfeirEventData: CreateSfeirEventDto
  ): Promise<SfeirEvent>;

  deleteSfeirEvent(id: string): Promise<void>;

  getAllowedEventPrompts(eventId: string): Promise<number>;

  countEventUsers(eventId: string): Promise<number>;

  countEventImages(eventId: string): Promise<number>;

  countStatusByEvent(eventId: string, status: string): Promise<number>;

  getEventUsers(eventId: string): Promise<User[]>;
}

export const SFEIR_EVENT_SERVICE = Symbol('SFEIR_EVENT_SERVICE');
