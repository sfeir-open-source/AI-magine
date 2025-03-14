import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SfeirEventMappers } from '@/core/application/sfeir-event/mappers/sfeir-event.mappers';
import { CreateSfeirEventDto } from '@/core/application/sfeir-event/dto/create-sfeir-event.dto';
import { SfeirEventService } from '@/core/application/sfeir-event/sfeir-event.service';
import {
  SFEIR_EVENT_REPOSITORY,
  SfeirEventRepository,
} from '@/core/domain/sfeir-event/sfeir-event.repository';
import { SfeirEvent } from '@/core/domain/sfeir-event/sfeir-event';
import {
  USER_REPOSITORY,
  UserRepository,
} from '@/core/domain/user/user.repository';

@Injectable()
export class SfeirEventServiceImpl implements SfeirEventService {
  constructor(
    @Inject(SFEIR_EVENT_REPOSITORY)
    private readonly sfeirEventRepository: SfeirEventRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository
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

  async getAllowedEventPrompts(eventId: string) {
    const event = await this.sfeirEventRepository.getSfeirEvent(eventId);
    if (!event) {
      throw new NotFoundException(`Event ${eventId} not found`);
    }
    return event.allowedPrompts;
  }

  async countEventUsers(eventId: string): Promise<number> {
    return this.userRepository.countUsersByEvent(eventId);
  }
}
