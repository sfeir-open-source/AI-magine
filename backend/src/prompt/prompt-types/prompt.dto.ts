import { ApiProperty } from '@nestjs/swagger';

export class CreatePromptBodyDto {
  @ApiProperty({
    name: 'browserFingerprint',
    description: 'Browser fingerprint',
  })
  browserFingerprint: string;

  @ApiProperty({
    name: 'userEmail',
    description: 'User email',
  })
  userEmail: string;

  @ApiProperty({
    name: 'userName',
    description: 'User name',
  })
  userName: string;

  @ApiProperty({
    name: 'jobTitle',
    description: 'Job title',
  })
  jobTitle: string;

  @ApiProperty({
    name: 'allowContact',
    description: 'Allow contact',
  })
  allowContact: boolean;

  @ApiProperty({
    name: 'prompt',
    description: 'Prompt',
  })
  prompt: string;
}

export type CreatePromptDto = CreatePromptBodyDto & {
  eventId: string;
};
