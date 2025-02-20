import { SfeirEventService, SfeirEvent } from '@/src/services/sfeir-event';

export type UseGetSfeirEventsOptions = {
  service: SfeirEventService;
};

export type UseGetSfeirEventsResponse = {
  sfeirEvents: SfeirEvent[];
  getSfeirEventsError: Error | null;
  isFetchingSfeirEvents: boolean;
};
