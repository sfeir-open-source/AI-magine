import { ApiProperty } from '@nestjs/swagger';

export class GetSfeirEventDto {
  @ApiProperty({
    name: 'id',
    description: 'Unique identifier of the event',
  })
  id: string;

  @ApiProperty({
    name: 'name',
    description: 'Name of the event',
  })
  name: string;

  @ApiProperty({
    name: 'allowedPrompts',
    description: 'Allowed prompts for the event',
  })
  allowedPrompts: number;

  @ApiProperty({
    name: 'startDate',
    description: 'Start date of the event',
  })
  startDate: string;

  @ApiProperty({
    name: 'endDate',
    description: 'End date of the event',
  })
  endDate: string;

  @ApiProperty({
    name: 'isActive',
    description: 'Is the event active',
  })
  isActive: boolean;
}
