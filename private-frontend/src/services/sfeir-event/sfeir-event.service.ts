import { CreateSfeirEventDto } from '@/src/services/sfeir-event/dtos';
import { SfeirEvent } from '@/src/services/sfeir-event';

export interface SfeirEventService {
  getSfeirEvents(): Promise<SfeirEvent[]>;

  createSfeirEvent(event: CreateSfeirEventDto): Promise<SfeirEvent>;

  deleteSfeirEvent(id: string): Promise<SfeirEvent>;
}
