import { Inject, Injectable } from '@nestjs/common';
import { CreatePromptDto } from '@/prompt/prompt-types/prompt.dto';
import { PROMPT_REPOSITORY, PromptRepository } from '@/prompt/prompt-types';
import { UserService } from '@/user/user.service';
import { Prompt } from '@/prompt/prompt-types/prompt.domain';
import { User } from '@/user/user-types';
import { ImageGenerationEngine } from '@/image-generation/image-generation.engine';
import { Subject } from 'rxjs';
import { ImageGenerationMessageEvent } from '@/image-generation/image-generation-types';

@Injectable()
export class PromptService {
  constructor(
    @Inject(PROMPT_REPOSITORY)
    private readonly promptRepository: PromptRepository,
    private readonly userService: UserService,
    private readonly imageGenerationEngine: ImageGenerationEngine
  ) {}

  async createPrompt({
    prompt,
    browserFingerprint,
    allowContact,
    userNickname,
    eventId,
    userEmail,
  }: CreatePromptDto): Promise<Prompt> {
    let userId = await this.userService.getUserIdByEmail(userEmail);
    if (!userId) {
      const createdUser = await this.userService.create(
        User.create(userEmail, browserFingerprint, allowContact, userNickname)
      );
      userId = createdUser.id;
    }
    if (!userId) {
      return Promise.reject('User not found');
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
    this.imageGenerationEngine.processPrompt(newPrompt.id, newPrompt.prompt);
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
