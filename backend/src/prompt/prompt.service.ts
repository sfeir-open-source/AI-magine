import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  CreatePromptBodyDto,
  PROMPT_REPOSITORY,
  PromptRepository,
} from '@/prompt/domain';
import { UserService } from '@/user/user.service';
import { Prompt } from '@/prompt/domain/prompt.domain';
import { ImageGenerationEngine } from '@/image-generation/image-generation.engine';
import { Subject } from 'rxjs';
import { ImageGenerationMessageEvent } from '@/image-generation/domain';
import { SfeirEventService } from '@/events/sfeir-event.service';

@Injectable()
export class PromptService {
  constructor(
    @Inject(PROMPT_REPOSITORY)
    private readonly promptRepository: PromptRepository,
    private readonly userService: UserService,
    private readonly imageGenerationEngine: ImageGenerationEngine,
    private readonly eventService: SfeirEventService
  ) {}

  async createPrompt({
    prompt,
    userId,
    eventId,
  }: CreatePromptBodyDto & { eventId: string }): Promise<Prompt> {
    const doesUserExists = await this.userService.checkIfExists(userId);

    const doesEventExists = !!(await this.eventService.getSfeirEvent(eventId));

    if (!doesUserExists) {
      throw new BadRequestException(
        'User requesting prompt creation does not exist'
      );
    }

    if (!doesEventExists) {
      throw new BadRequestException('Event does not exists');
    }

    const userPromptCountOnEvent =
      await this.promptRepository.countByEventIdAndUserId(userId, eventId);

    // TODO: Check with @allienna if we need to define maximum prompt in the event definition
    if (userPromptCountOnEvent >= 3) {
      return Promise.reject('User has reached maximum number of prompts');
    }

    const newPrompt = await this.promptRepository.save(
      Prompt.create(eventId, userId, prompt)
    );
    this.imageGenerationEngine.processPrompt(
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
    return this.imageGenerationEngine.listenForPromptGenerationDone(
      promptId,
      progress
    );
  }
}
