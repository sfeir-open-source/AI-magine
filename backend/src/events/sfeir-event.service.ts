import {
  CreateSfeirEventDto,
  SfeirEventBuilder,
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

  async getSfeirEvents(): Promise<ReturnType<SfeirEventBuilder['build']>[]> {
    return this.sfeirEventRepository.getSfeirEvents();
  }

  async getSfeirEvent(
    id: string
  ): Promise<ReturnType<SfeirEventBuilder['build']> | undefined> {
    return this.sfeirEventRepository.getSfeirEvent(id);
  }

  async createSfeirEvent({
    name,
    startDateTimestamp,
    endDateTimestamp,
  }: CreateSfeirEventDto): Promise<ReturnType<SfeirEventBuilder['build']>> {
    const newEventBuilder = SfeirEventBuilder.create()
      .withName(name)
      .withStartDate(new Date(parseInt(startDateTimestamp)))
      .withEndDate(new Date(parseInt(endDateTimestamp)));

    return this.sfeirEventRepository.saveSfeirEvent(newEventBuilder.build());
  }

  async deleteSfeirEvent(id: string): Promise<void> {
    return this.sfeirEventRepository.deleteSfeirEvent(id);
  }
}
