import { SfeirEvent } from '@/core/domain/sfeir-event/sfeir-event';

export const SFEIR_EVENT_REPOSITORY = Symbol('SFEIR_EVENT_REPOSITORY');

export interface SfeirEventRepository {
  getSfeirEvents(): Promise<SfeirEvent[]>;

  saveSfeirEvent(sfeirEvent: SfeirEvent): Promise<SfeirEvent>;

  deleteSfeirEvent(id: string): Promise<void>;

  getSfeirEvent(id: string): Promise<SfeirEvent | undefined>;
}
