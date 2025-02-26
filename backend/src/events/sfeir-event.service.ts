import {
  CreateSfeirEventDto,
  SfeirEvent,
  SFEIR_EVENT_REPOSITORY,
  SfeirEventRepository,
} from '@/events/events-types';
import { Inject, Injectable } from '@nestjs/common';

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
        new Date(parseInt(startDateTimestamp)),
        new Date(parseInt(endDateTimestamp))
      )
    );
  }

  async deleteSfeirEvent(id: string): Promise<void> {
    return this.sfeirEventRepository.deleteSfeirEvent(id);
  }
}
