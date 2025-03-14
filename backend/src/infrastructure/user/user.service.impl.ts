import { Inject, Injectable } from '@nestjs/common';
import { EncryptionService } from '@/infrastructure/shared/encryption/encryption.service';
import { RemainingPromptsDto } from '@/core/application/user/dto/remaining-prompts.dto';
import {
  IMAGES_REPOSITORY,
  ImageRepository,
} from '@/core/domain/image/image.repository';
import { UserService } from '@/core/application/user/user.service';
import {
  USER_REPOSITORY,
  UserRepository,
} from '@/core/domain/user/user.repository';
import {
  SFEIR_EVENT_REPOSITORY,
  SfeirEventRepository,
} from '@/core/domain/sfeir-event/sfeir-event.repository';
import { User } from '@/core/domain/user/user';

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(IMAGES_REPOSITORY)
    private readonly imagesRepository: ImageRepository,
    @Inject(SFEIR_EVENT_REPOSITORY)
    private readonly eventRepository: SfeirEventRepository,
    private readonly encryptionService: EncryptionService
  ) {}

  async create(user: User): Promise<User> {
    return this.userRepository.save({
      ...user,
      email: this.encryptionService.encryptEmail(user.email),
    });
  }

  async getUserIdByEmail(email: string): Promise<string | undefined> {
    return this.userRepository.getUserIdByEmail(
      this.encryptionService.encryptEmail(email)
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.getUserByEmail(
      this.encryptionService.encryptEmail(email)
    );
  }

  async checkIfExists(userId: string): Promise<boolean> {
    return this.userRepository.checkExistsById(userId);
  }

  async getUserRemainingPromptsByEvent(
    userId: string,
    eventId: string
  ): Promise<RemainingPromptsDto> {
    const event = await this.eventRepository.getSfeirEvent(eventId);
    const images = await this.imagesRepository.getImageByEventIdAndUserId(
      eventId,
      userId
    );

    return {
      spent: images.length,
      remaining: (event?.allowedPrompts ?? 0) - images.length,
      allowed: event?.allowedPrompts ?? 0,
    };
  }
}
