import { ApiProperty } from '@nestjs/swagger';

export class CreateSfeirEventDto {
  @ApiProperty({
    name: 'name',
    description: 'Name of the event',
  })
  name: string;

  @ApiProperty({
    name: 'startDateTimestamp',
    description: 'Start date timestamp of the event',
  })
  startDateTimestamp: string;

  @ApiProperty({
    name: 'endDateTimestamp',
    description: 'End date timestamp of the event',
  })
  endDateTimestamp: string;
}
