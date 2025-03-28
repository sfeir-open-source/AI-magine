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
import {
  ImageRepository,
  IMAGES_REPOSITORY,
} from '@/core/domain/image/image.repository';
import {
  IMAGE_GENERATION_STATUS_REPOSITORY,
  ImageGenerationStatusRepository,
} from '@/core/domain/image-generation/image-generation-status.repository';
import { EncryptionService } from '@/infrastructure/shared/encryption/encryption.service';

@Injectable()
export class SfeirEventServiceImpl implements SfeirEventService {
  constructor(
    @Inject(SFEIR_EVENT_REPOSITORY)
    private readonly sfeirEventRepository: SfeirEventRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(IMAGES_REPOSITORY)
    private readonly imageRepository: ImageRepository,
    @Inject(IMAGE_GENERATION_STATUS_REPOSITORY)
    private readonly imageGenerationStatusRepository: ImageGenerationStatusRepository,
    private readonly encryptionService: EncryptionService
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

  async countEventImages(eventId: string): Promise<number> {
    return this.imageRepository.countImagesByEvent(eventId);
  }

  async countStatusByEvent(eventId: string, status: string): Promise<number> {
    return this.imageGenerationStatusRepository.countStatusByEvent(
      eventId,
      status
    );
  }

  async getEventUsers(eventId: string) {
    const event = await this.sfeirEventRepository.getSfeirEvent(eventId);
    if (!event) throw new NotFoundException(`Event ${eventId} not found`);
    const eventUsers = await this.userRepository.getUsersByEvent(eventId);
    return eventUsers.map((user) => ({
      ...user,
      email: this.encryptionService.decryptEmail(user.email),
    }));
  }
}
