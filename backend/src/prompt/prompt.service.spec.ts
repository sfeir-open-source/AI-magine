import { vi } from 'vitest';

import { PromptService } from '@/prompt/prompt.service';
import { PromptRepository } from 'src/prompt/domain';
import { UserService } from '@/user/user.service';
import { Prompt } from '@/prompt/domain/prompt.domain';
import { User } from 'src/user/domain';
import { ImageGenerationEngine } from '@/image-generation/image-generation.engine';
import { CreatePromptResponseDto } from '@/prompt/dto/create-prompt.response.dto';

describe('PromptService', () => {
  let promptService: PromptService;
  let promptRepositoryMock: PromptRepository;
  let userServiceMock: UserService;
  let imageGenerationEngineMock: ImageGenerationEngine;

  beforeEach(() => {
    promptRepositoryMock = {
      save: vi.fn(),
      countByEventIdAndUserId: vi.fn(),
    };

    userServiceMock = {
      create: vi.fn(),
      getUserIdByEmail: vi.fn(),
    } as unknown as UserService;

    imageGenerationEngineMock = {
      processPrompt: vi.fn(),
    } as unknown as ImageGenerationEngine;

    promptService = new PromptService(
      promptRepositoryMock,
      userServiceMock,
      imageGenerationEngineMock
    );
  });

  it('should create a new prompt if all conditions are met', async () => {
    const dto: CreatePromptResponseDto & { eventId: string } = {
      eventId: 'event1',
      prompt: 'Sample Prompt',
      browserFingerprint: 'fingerprint123',
      userEmail: 'email@example.com',
      userNickname: 'John Doe',
      allowContact: true,
    };

    const expectedPrompt = Prompt.from(
      expect.any(String),
      'event1',
      'existingUserId',
      'Sample Prompt'
    );
    vi.mocked(userServiceMock.getUserIdByEmail).mockResolvedValue(
      'existingUserId'
    );
    vi.mocked(promptRepositoryMock.countByEventIdAndUserId).mockResolvedValue(
      2
    );
    vi.mocked(promptRepositoryMock.save).mockResolvedValue(expectedPrompt);

    const result = await promptService.createPrompt(dto);

    expect(result).toEqual(expectedPrompt);
    expect(userServiceMock.getUserIdByEmail).toHaveBeenCalledWith(
      'email@example.com'
    );
    expect(promptRepositoryMock.countByEventIdAndUserId).toHaveBeenCalledWith(
      'existingUserId',
      'event1'
    );
    expect(promptRepositoryMock.save).toHaveBeenCalledWith(expectedPrompt);
  });

  it('should create a new user if the user email does not exist', async () => {
    const dto: CreatePromptResponseDto & { eventId: string } = {
      eventId: 'event1',
      prompt: 'Sample Prompt',
      browserFingerprint: 'fingerprint123',
      userEmail: 'email@example.com',
      userNickname: 'John Doe',
      allowContact: true,
    };

    const createdUser = User.from(
      expect.any(String),
      'email@example.com',
      'fingerprint123',
      true,
      'John Doe'
    );
    const expectedPrompt = Prompt.from(
      expect.any(String),
      'event1',
      'generatedUserId',
      'Sample Prompt'
    );

    vi.mocked(userServiceMock.getUserIdByEmail).mockResolvedValue(undefined);
    vi.mocked(userServiceMock.create).mockResolvedValue(createdUser);
    vi.mocked(promptRepositoryMock.countByEventIdAndUserId).mockResolvedValue(
      0
    );
    vi.mocked(promptRepositoryMock.save).mockResolvedValue(expectedPrompt);

    const result = await promptService.createPrompt(dto);

    expect(result).toEqual(expectedPrompt);
    expect(userServiceMock.getUserIdByEmail).toHaveBeenCalledWith(
      'email@example.com'
    );
    expect(userServiceMock.create).toHaveBeenCalledWith(createdUser);
    expect(promptRepositoryMock.countByEventIdAndUserId).toHaveBeenCalledWith(
      'generatedUserId',
      'event1'
    );
    expect(promptRepositoryMock.save).toHaveBeenCalledWith(expectedPrompt);
  });

  it('should throw an error if the user has reached the maximum number of prompts for an event', async () => {
    const dto: CreatePromptResponseDto & { eventId: string } = {
      eventId: 'event1',
      prompt: 'Sample Prompt',
      browserFingerprint: 'fingerprint123',
      userEmail: 'email@example.com',
      userNickname: 'John Doe',
      allowContact: true,
    };

    vi.mocked(userServiceMock.getUserIdByEmail).mockResolvedValue(
      'existingUserId'
    );
    vi.mocked(promptRepositoryMock.countByEventIdAndUserId).mockResolvedValue(
      3
    );

    await expect(promptService.createPrompt(dto)).rejects.toBe(
      'User has reached maximum number of prompts'
    );
    expect(userServiceMock.getUserIdByEmail).toHaveBeenCalledWith(
      'email@example.com'
    );
    expect(promptRepositoryMock.countByEventIdAndUserId).toHaveBeenCalledWith(
      'existingUserId',
      'event1'
    );
  });

  it('should throw an error if user creation fails and userId is not found', async () => {
    const dto: CreatePromptResponseDto & { eventId: string } = {
      eventId: 'event1',
      prompt: 'Sample Prompt',
      browserFingerprint: 'fingerprint123',
      userEmail: 'email@example.com',
      userNickname: 'John Doe',
      allowContact: true,
    };

    vi.mocked(userServiceMock.getUserIdByEmail).mockResolvedValue(undefined);
    vi.mocked(userServiceMock.create).mockResolvedValue({
      id: '',
      hashedEmail: '',
      nickname: '',
      browserFingerprint: '',
      allowContact: false,
    });

    await expect(promptService.createPrompt(dto)).rejects.toBe(
      'User not found'
    );
    expect(userServiceMock.getUserIdByEmail).toHaveBeenCalledWith(
      'email@example.com'
    );
    expect(userServiceMock.create).toHaveBeenCalled();
  });
});
