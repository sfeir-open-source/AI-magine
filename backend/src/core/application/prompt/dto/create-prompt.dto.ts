import { ApiProperty } from '@nestjs/swagger';

export class CreatePromptBodyDto {
  @ApiProperty({
    name: 'userId',
    description: 'User id making the request',
  })
  userId: string;

  @ApiProperty({
    name: 'prompt',
    description: 'Prompt',
  })
  prompt: string;
}
