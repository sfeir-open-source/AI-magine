import { Injectable } from '@nestjs/common';
import { HealthStatus } from '@/health/health-types';

@Injectable()
export class HealthService {
  async getLiveness(): Promise<HealthStatus> {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
    };
  }

  async getReadiness(): Promise<HealthStatus> {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
      details: {},
    };
  }
}
