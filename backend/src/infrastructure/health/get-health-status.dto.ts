import { ApiProperty } from '@nestjs/swagger';

export class HealthStatusDto {
  @ApiProperty({
    enum: ['UP', 'DOWN'],
    description: 'Current health status',
  })
  status: 'UP' | 'DOWN';

  @ApiProperty({
    description: 'Timestamp of the health check',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Additional health check details',
    required: false,
  })
  details?: Record<string, unknown>;
}
