import { HealthStatus } from './types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  async getLiveness(): Promise<HealthStatus> {
    return {
      status: 'UP',
      timestamp: new Date().toISOString()
    };
  }

  async getReadiness(): Promise<HealthStatus> {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
      details: {

      }
    };
  }
}
