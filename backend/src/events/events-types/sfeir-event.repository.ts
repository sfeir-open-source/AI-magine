import { SfeirEventBuilder } from '@/events/events-types/sfeir-event.domain';

export const SFEIR_EVENT_REPOSITORY = Symbol('SFEIR_EVENT_REPOSITORY');

export interface SfeirEventRepository {
  getSfeirEvents(): Promise<ReturnType<SfeirEventBuilder['build']>[]>;

  saveSfeirEvent(
    sfeirEvent: ReturnType<SfeirEventBuilder['build']>
  ): Promise<ReturnType<SfeirEventBuilder['build']>>;

  deleteSfeirEvent(id: string): Promise<void>;

  getSfeirEvent(
    id: string
  ): Promise<ReturnType<SfeirEventBuilder['build']> | undefined>;
}
