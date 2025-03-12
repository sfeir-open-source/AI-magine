import { ApiProperty } from '@nestjs/swagger';

export class RemainingPromptsDto {
  @ApiProperty()
  spent: number;

  @ApiProperty()
  remaining: number;

  @ApiProperty()
  allowed: number;
}
