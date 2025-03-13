import { Inject, Injectable } from '@nestjs/common';
import { User, USER_REPOSITORY, UserRepository } from '@/user/domain';
import { EncryptionService } from '@/user/encryption/encryption.service';
import { RemainingPromptsDto } from '@/user/dto/remaining-prompts.dto';
import {
  IMAGES_REPOSITORY,
  ImagesRepository,
} from '@/images/domain/images.repository';
import { SFEIR_EVENT_REPOSITORY, SfeirEventRepository } from '@/events/domain';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly encryptionService: EncryptionService,
    @Inject(IMAGES_REPOSITORY)
    private readonly imagesRepository: ImagesRepository,
    @Inject(SFEIR_EVENT_REPOSITORY)
    private readonly eventRepository: SfeirEventRepository
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
    eventId: string,
    userId: string
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
