import { SfeirEvent } from '@/core/domain/sfeir-event/sfeir-event';
import { CreateSfeirEventDto } from '@/core/application/sfeir-event/dto/create-sfeir-event.dto';

export interface SfeirEventService {
  getSfeirEvents(): Promise<SfeirEvent[]>;

  getSfeirEvent(id: string): Promise<SfeirEvent | undefined>;

  createSfeirEvent(
    createSfeirEventData: CreateSfeirEventDto
  ): Promise<SfeirEvent>;

  deleteSfeirEvent(id: string): Promise<void>;

  getAllowedEventPrompts(eventId: string): Promise<number>;
}

export const SFEIR_EVENT_SERVICE = Symbol('SFEIR_EVENT_SERVICE');
