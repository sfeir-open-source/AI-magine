import { ApiProperty } from '@nestjs/swagger';

export class SfeirEventDto {
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
