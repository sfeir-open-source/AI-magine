import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { HealthStatusDto } from '@/health/dto/get-health-status.dto';

@Controller('health')
@ApiTags('Health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('/live')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get application liveness status' })
  @ApiResponse({
    status: 200,
    description: 'Application is alive',
    type: HealthStatusDto,
  })
  async getLiveness(): Promise<HealthStatusDto> {
    return this.healthService.getLiveness();
  }

  @Get('/ready')
  @ApiOperation({ summary: 'Get application readiness status' })
  @ApiResponse({
    status: 200,
    description: 'Application is ready to serve requests',
    type: HealthStatusDto,
  })
  async getReadiness(): Promise<HealthStatusDto> {
    return this.healthService.getReadiness();
  }
}
