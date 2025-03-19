import { Prompt } from '@/core/domain/prompt/prompt';
import { BadRequestException } from '@nestjs/common';
import { PromptServiceImpl } from '@/infrastructure/prompt/prompt.service.impl';
import { PromptRepository } from '@/core/domain/prompt/prompt.repository';
import { PromptService } from '@/core/application/prompt/prompt.service';
import { UserService } from '@/core/application/user/user.service';
import { SfeirEventService } from '@/core/application/sfeir-event/sfeir-event.service';
import { ImageGenerationService } from '@/core/application/image-generation/image-generation.service';
import { SfeirEvent } from '@/core/domain/sfeir-event/sfeir-event';
import { CreatePromptBodyDto } from '@/core/application/prompt/dto/create-prompt.dto';
import { ImageService } from '@/core/application/image/image.service';
import { ImageWithPromptTextDto } from '@/core/application/image/dto/image-with-prompt-text.dto';

describe('PromptService', () => {
  let promptService: PromptService;
  let promptRepositoryMock: PromptRepository;
  let userServiceMock: UserService;
  let eventServiceMock: SfeirEventService;
  let imagesServiceMock: ImageService;
  let imageGenerationServiceMock: ImageGenerationService;

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

    imagesServiceMock = {
      getImagesByEventAndUser: vi.fn(),
    } as unknown as ImageService;

    imageGenerationServiceMock = {
      generateImageFromPrompt: vi.fn(),
    } as unknown as ImageGenerationService;

    promptService = new PromptServiceImpl(
      promptRepositoryMock,
      eventServiceMock,
      userServiceMock,
      imagesServiceMock,
      imageGenerationServiceMock
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

    it('should throw BadRequestException if event is not active', async () => {
      const mockedEvent = SfeirEvent.from(
        'event1',
        'event',
        3,
        new Date(Date.now() + 1000),
        new Date(Date.now() + 2000)
      );
      vi.mocked(userServiceMock.checkIfExists).mockResolvedValue(true);
      vi.mocked(eventServiceMock.getSfeirEvent).mockResolvedValue(mockedEvent);

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
      vi.mocked(imagesServiceMock.getImagesByEventAndUser).mockResolvedValue([
        {
          id: 'image-id',
          promptId: 'prompt-id',
          url: 'http://example.com/image.png',
          selected: false,
          createdAt: new Date(),
          prompt: 'prompt',
          author: 'author',
        } as ImageWithPromptTextDto,
      ]);
      vi.mocked(promptRepositoryMock.save).mockResolvedValue(expectedPrompt);

      const result = await promptService.createPrompt(dto);

      expect(result).toEqual(expectedPrompt);
      expect(userServiceMock.checkIfExists).toHaveBeenCalled();
      expect(eventServiceMock.getSfeirEvent).toHaveBeenCalled();
      expect(imagesServiceMock.getImagesByEventAndUser).toHaveBeenCalledWith(
        'event1',
        'existingUserId'
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
        SfeirEvent.from('event1', 'event', 1, new Date(), new Date())
      );
      vi.mocked(imagesServiceMock.getImagesByEventAndUser).mockResolvedValue([
        {
          id: 'image-id',
          promptId: 'prompt-id',
          url: 'http://example.com/image.png',
          selected: false,
          createdAt: new Date(),
          prompt: 'prompt',
          author: 'author',
        } as ImageWithPromptTextDto,
      ]);

      await expect(promptService.createPrompt(dto)).rejects.toThrow(
        new BadRequestException('User has reached maximum number of prompts')
      );
      expect(userServiceMock.checkIfExists).toHaveBeenCalled();
      expect(eventServiceMock.getSfeirEvent).toHaveBeenCalled();
      expect(imagesServiceMock.getImagesByEventAndUser).toHaveBeenCalledWith(
        'event1',
        'existingUserId'
      );
    });
  });
});
