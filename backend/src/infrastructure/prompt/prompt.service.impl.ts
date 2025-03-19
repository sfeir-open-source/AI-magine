import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Prompt } from '@/core/domain/prompt/prompt';
import { Subject } from 'rxjs';
import { PromptService } from '@/core/application/prompt/prompt.service';
import {
  PROMPT_REPOSITORY,
  PromptRepository,
} from '@/core/domain/prompt/prompt.repository';
import { CreatePromptBodyDto } from '@/core/application/prompt/dto/create-prompt.dto';
import { ImageGenerationMessageEvent } from '@/core/application/image-generation/image-generation-message-event';
import {
  SFEIR_EVENT_SERVICE,
  SfeirEventService,
} from '@/core/application/sfeir-event/sfeir-event.service';
import {
  USER_SERVICE,
  UserService,
} from '@/core/application/user/user.service';
import {
  IMAGE_GENERATION_SERVICE,
  ImageGenerationService,
} from '@/core/application/image-generation/image-generation.service';
import {
  IMAGE_SERVICE,
  ImageService,
} from '@/core/application/image/image.service';

@Injectable()
export class PromptServiceImpl implements PromptService {
  constructor(
    @Inject(PROMPT_REPOSITORY)
    private readonly promptRepository: PromptRepository,
    @Inject(SFEIR_EVENT_SERVICE)
    private readonly eventService: SfeirEventService,
    @Inject(USER_SERVICE)
    private readonly userService: UserService,
    @Inject(IMAGE_SERVICE)
    private readonly imagesService: ImageService,
    @Inject(IMAGE_GENERATION_SERVICE)
    private readonly imageGenerationService: ImageGenerationService
  ) {}

  async createPrompt({
    prompt,
    userId,
    eventId,
  }: CreatePromptBodyDto & { eventId: string }): Promise<Prompt> {
    const doesUserExists = await this.userService.checkIfExists(userId);

    const event = await this.eventService.getSfeirEvent(eventId);

    if (!doesUserExists) {
      throw new BadRequestException(
        'User requesting prompt creation does not exist'
      );
    }

    if (!event) {
      throw new BadRequestException('Event does not exists');
    }

    if (!event.isActive()) {
      throw new BadRequestException('Event is not active');
    }

    const userImages = await this.imagesService.getImagesByEventAndUser(
      eventId,
      userId
    );

    if (userImages.length >= event.allowedPrompts) {
      throw new BadRequestException(
        'User has reached maximum number of prompts'
      );
    }

    const newPrompt = await this.promptRepository.save(
      Prompt.create(eventId, userId, prompt)
    );

    this.imageGenerationService.generateImageFromPrompt(
      eventId,
      newPrompt.id,
      newPrompt.prompt
    );

    return newPrompt;
  }

  getGenerationStatus(
    promptId: string,
    progress: Subject<ImageGenerationMessageEvent>
  ) {
    return this.imageGenerationService.listenForPromptGenerationDone(
      promptId,
      progress
    );
  }
}
