import { Inject, Injectable } from '@nestjs/common';
import { CreatePromptDto } from '@/prompt/prompt-types/prompt.dto';
import { nanoid } from 'nanoid';
import { PROMPT_REPOSITORY, PromptRepository } from '@/prompt/prompt-types';
import { UserService } from '@/user/user.service';
import { Prompt } from '@/prompt/prompt-types/prompt.domain';

@Injectable()
export class PromptService {
  constructor(
    @Inject(PROMPT_REPOSITORY)
    private readonly promptRepository: PromptRepository,
    private readonly userService: UserService
  ) {}

  async createPrompt({
    eventId,
    prompt,
    browserFingerprint,
    userEmail,
    userName,
    jobTitle,
    allowContact,
  }: CreatePromptDto & { eventId: string }): Promise<Prompt> {
    let userId = await this.userService.getUserIdByEmail(userEmail);
    if (!userId) {
      const createdUser = await this.userService.create({
        id: nanoid(32),
        hashedEmail: userEmail,
        name: userName,
        jobTitle,
        browserFingerprint,
        allowContact,
      });
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
    const newPrompt = await this.promptRepository.save({
      id: nanoid(32),
      userId,
      eventId,
      prompt,
    });
    return Promise.resolve(newPrompt);
  }
}
