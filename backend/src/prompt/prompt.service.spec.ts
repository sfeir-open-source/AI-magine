import { CreatePromptBodyDto, PromptRepository } from '@/prompt/domain';
import { UserService } from '@/user/user.service';
import { Prompt } from '@/prompt/domain/prompt.domain';
import { ImageGenerationEngine } from '@/image-generation/image-generation.engine';
import { BadRequestException } from '@nestjs/common';
import { PromptService } from '@/prompt/prompt.service';
import { SfeirEventService } from '@/events/sfeir-event.service';
import { SfeirEvent } from '@/events/domain';

describe('PromptService', () => {
  let promptService: PromptService;
  let promptRepositoryMock: PromptRepository;
  let userServiceMock: UserService;
  let eventServiceMock: SfeirEventService;
  let imageGenerationEngineMock: ImageGenerationEngine;

  beforeEach(() => {
    promptRepositoryMock = {
      save: vi.fn(),
      countByEventIdAndUserId: vi.fn(),
    };

    eventServiceMock = {
      getAllowedEventPrompts: vi.fn().mockResolvedValue(3),
    } as unknown as SfeirEventService;

    userServiceMock = {
      create: vi.fn(),
      checkIfExists: vi.fn(),
    } as unknown as UserService;

    eventServiceMock = {
      getSfeirEvent: vi.fn(),
      getAllowedEventPrompts: vi.fn().mockResolvedValue(3),
    } as unknown as SfeirEventService;

    imageGenerationEngineMock = {
      processPrompt: vi.fn(),
    } as unknown as ImageGenerationEngine;

    promptService = new PromptService(
      promptRepositoryMock,
      eventServiceMock,
      userServiceMock,
      imageGenerationEngineMock
    );
  });

  describe('createPrompt', () => {
    it('should throw BadRequestException if user does not exists', async () => {
      vi.mocked(userServiceMock.checkIfExists).mockResolvedValue(false);

      await expect(() =>
        promptService.createPrompt({
          prompt: 'test',
          eventId: 'test-event-id',
          userId: 'unknown',
        })
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if event does not exists', async () => {
      vi.mocked(userServiceMock.checkIfExists).mockResolvedValue(true);
      vi.mocked(eventServiceMock.getSfeirEvent).mockResolvedValue(undefined);

      await expect(() =>
        promptService.createPrompt({
          prompt: 'test',
          eventId: 'test-event-id',
          userId: 'unknown',
        })
      ).rejects.toThrow(BadRequestException);
    });

    it('should create a new prompt if all conditions are met', async () => {
      const dto: CreatePromptBodyDto & { eventId: string } = {
        eventId: 'event1',
        prompt: 'Sample Prompt',
        userId: 'existingUserId',
      };

      const expectedPrompt = Prompt.from(
        expect.any(String),
        'event1',
        'existingUserId',
        'Sample Prompt'
      );
      vi.mocked(userServiceMock.checkIfExists).mockResolvedValue(true);
      vi.mocked(eventServiceMock.getSfeirEvent).mockResolvedValue(
        SfeirEvent.from('event1', 'event', 3, new Date(), new Date())
      );
      vi.mocked(promptRepositoryMock.countByEventIdAndUserId).mockResolvedValue(
        2
      );
      vi.mocked(promptRepositoryMock.save).mockResolvedValue(expectedPrompt);

      const result = await promptService.createPrompt(dto);

      expect(result).toEqual(expectedPrompt);
      expect(userServiceMock.checkIfExists).toHaveBeenCalled();
      expect(eventServiceMock.getSfeirEvent).toHaveBeenCalled();
      expect(promptRepositoryMock.countByEventIdAndUserId).toHaveBeenCalledWith(
        'existingUserId',
        'event1'
      );
      expect(promptRepositoryMock.save).toHaveBeenCalledWith(expectedPrompt);
    });

    it('should throw an error if the user has reached the maximum number of prompts for an event', async () => {
      const dto: CreatePromptBodyDto & { eventId: string } = {
        eventId: 'event1',
        prompt: 'Sample Prompt',
        userId: 'existingUserId',
      };

      vi.mocked(userServiceMock.checkIfExists).mockResolvedValue(true);
      vi.mocked(eventServiceMock.getSfeirEvent).mockResolvedValue(
        SfeirEvent.from('event1', 'event', 3, new Date(), new Date())
      );
      vi.mocked(promptRepositoryMock.countByEventIdAndUserId).mockResolvedValue(
        3
      );

      await expect(promptService.createPrompt(dto)).rejects.toBe(
        'User has reached maximum number of prompts'
      );
      expect(userServiceMock.checkIfExists).toHaveBeenCalled();
      expect(eventServiceMock.getSfeirEvent).toHaveBeenCalled();
      expect(promptRepositoryMock.countByEventIdAndUserId).toHaveBeenCalledWith(
        'existingUserId',
        'event1'
      );
    });
  });
});
