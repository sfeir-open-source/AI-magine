import {
  CreateSfeirEventDto,
  SfeirEvent,
  SFEIR_EVENT_REPOSITORY,
  SfeirEventRepository,
} from '@/events/events-types';
import { Inject, Injectable } from '@nestjs/common';
import { SfeirEventMappers } from '@/events/events-types/sfeir-event.mappers';

@Injectable()
export class SfeirEventService {
  constructor(
    @Inject(SFEIR_EVENT_REPOSITORY)
    private readonly sfeirEventRepository: SfeirEventRepository
  ) {}

  async getSfeirEvents(): Promise<SfeirEvent[]> {
    return this.sfeirEventRepository.getSfeirEvents();
  }

  async getSfeirEvent(id: string): Promise<SfeirEvent | undefined> {
    return this.sfeirEventRepository.getSfeirEvent(id);
  }

  async createSfeirEvent({
    name,
    startDateTimestamp,
    endDateTimestamp,
  }: CreateSfeirEventDto): Promise<SfeirEvent> {
    return this.sfeirEventRepository.saveSfeirEvent(
      SfeirEvent.create(
        name,
        SfeirEventMappers.fromTimestampStringToDate(startDateTimestamp),
        SfeirEventMappers.fromTimestampStringToDate(endDateTimestamp)
      )
    );
  }

  async deleteSfeirEvent(id: string): Promise<void> {
    return this.sfeirEventRepository.deleteSfeirEvent(id);
  }
}
