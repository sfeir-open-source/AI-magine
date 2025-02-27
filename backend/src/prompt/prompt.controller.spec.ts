import { PromptController } from '@/prompt/prompt.controller';
import { vi } from 'vitest';
import { PromptService } from '@/prompt/prompt.service';
import { CreatePromptDto } from '@/prompt/prompt-types';
import { Response } from 'express';

describe('PromptController', () => {
  let promptController: PromptController;
  let promptService: PromptService;

  beforeEach(() => {
    promptService = {
      createPrompt: vi.fn(),
    } as unknown as PromptService;

    promptController = new PromptController(promptService);
  });

  describe('createPrompt', () => {
    it('should call PromptService.createPrompt with correct parameters and return the result', async () => {
      const eventId = 'event123';
      const createDto: CreatePromptDto = {
        browserFingerprint: 'unique-browser-fingerprint',
        userEmail: 'user@example.com',
        userName: 'John Doe',
        jobTitle: 'Software Engineer',
        allowContact: true,
        prompt: 'Test prompt',
      };

      const mockResult = {
        id: 'mock-id',
        userId: 'mock-user-id',
        eventId,
        prompt: createDto.prompt,
      };

      const mockResponse = {
        cookie: vi.fn(),
      } as unknown as Response;

      vi.spyOn(promptService, 'createPrompt').mockResolvedValueOnce(mockResult);

      const response = await promptController.createPrompt(
        eventId,
        createDto,
        mockResponse
      );

      expect(promptService.createPrompt).toHaveBeenCalledTimes(1);
      expect(promptService.createPrompt).toHaveBeenCalledWith({
        ...createDto,
        eventId,
        userEmail: expect.any(String),
      });
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'userId',
        mockResult.userId,
        {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        }
      );
      expect(response).toEqual(mockResult);
    });
  });
});
