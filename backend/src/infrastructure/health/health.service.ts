import { Injectable } from '@nestjs/common';
import { HealthStatusDto } from '@/infrastructure/health/get-health-status.dto';

@Injectable()
export class HealthService {
  async getLiveness(): Promise<HealthStatusDto> {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
    };
  }

  async getReadiness(): Promise<HealthStatusDto> {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
      details: {},
    };
  }
}
