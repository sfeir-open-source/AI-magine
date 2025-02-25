import { beforeEach, describe, expect, it, vi } from 'vitest';

import { nanoid } from 'nanoid';
import { PromptService } from '@/prompt/prompt.service';
import { CreatePromptDto, PromptRepository } from '@/prompt/prompt-types';
import { UserService } from '@/user/user.service';

vi.mock('nanoid', () => {
  return {
    nanoid: vi.fn(),
  };
});

describe('PromptService', () => {
  let promptService: PromptService;
  let promptRepositoryMock: PromptRepository;
  let userServiceMock: UserService;

  beforeEach(() => {
    promptRepositoryMock = {
      save: vi.fn(),
      countByEventIdAndUserId: vi.fn(),
    };

    userServiceMock = {
      create: vi.fn(),
      getUserIdByEmail: vi.fn(),
    } as unknown as UserService;

    promptService = new PromptService(promptRepositoryMock, userServiceMock);
  });

  it('should create a new prompt if all conditions are met', async () => {
    const dto: CreatePromptDto & { eventId: string } = {
      eventId: 'event1',
      prompt: 'Sample Prompt',
      browserFingerprint: 'fingerprint123',
      userEmail: 'email@example.com',
      userName: 'John Doe',
      jobTitle: 'Engineer',
      allowContact: true,
    };

    vi.mocked(nanoid)
      .mockReturnValueOnce('generatedPromptId')
      .mockReturnValueOnce('generatedUserId');

    const expectedPrompt = {
      id: 'generatedPromptId',
      eventId: 'event1',
      userId: 'existingUserId',
      prompt: 'Sample Prompt',
    };
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
    const dto: CreatePromptDto & { eventId: string } = {
      eventId: 'event1',
      prompt: 'Sample Prompt',
      browserFingerprint: 'fingerprint123',
      userEmail: 'email@example.com',
      userName: 'John Doe',
      jobTitle: 'Engineer',
      allowContact: true,
    };

    vi.mocked(nanoid)
      .mockReturnValueOnce('generatedPromptId')
      .mockReturnValueOnce('generatedPromptId');
    vi.mocked(nanoid)
      .mockReturnValueOnce('generatedUserId')
      .mockReturnValueOnce('generatedUserId');

    const createdUser = {
      id: 'generatedUserId',
      hashedEmail: 'email@example.com',
      name: 'John Doe',
      jobTitle: 'Engineer',
      browserFingerprint: 'fingerprint123',
      allowContact: true,
    };
    const expectedPrompt = {
      id: 'generatedPromptId',
      eventId: 'event1',
      userId: 'generatedUserId',
      prompt: 'Sample Prompt',
    };

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
    expect(userServiceMock.create).toHaveBeenCalledWith({
      id: 'generatedUserId',
      hashedEmail: 'email@example.com',
      name: 'John Doe',
      jobTitle: 'Engineer',
      browserFingerprint: 'fingerprint123',
      allowContact: true,
    });
    expect(promptRepositoryMock.countByEventIdAndUserId).toHaveBeenCalledWith(
      'generatedUserId',
      'event1'
    );
    expect(promptRepositoryMock.save).toHaveBeenCalledWith(expectedPrompt);
  });

  it('should throw an error if the user has reached the maximum number of prompts for an event', async () => {
    const dto: CreatePromptDto & { eventId: string } = {
      eventId: 'event1',
      prompt: 'Sample Prompt',
      browserFingerprint: 'fingerprint123',
      userEmail: 'email@example.com',
      userName: 'John Doe',
      jobTitle: 'Engineer',
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
    const dto: CreatePromptDto & { eventId: string } = {
      eventId: 'event1',
      prompt: 'Sample Prompt',
      browserFingerprint: 'fingerprint123',
      userEmail: 'email@example.com',
      userName: 'John Doe',
      jobTitle: 'Engineer',
      allowContact: true,
    };

    vi.mocked(userServiceMock.getUserIdByEmail).mockResolvedValue(undefined);
    vi.mocked(userServiceMock.create).mockResolvedValue({
      id: '',
      hashedEmail: '',
      name: '',
      jobTitle: '',
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
