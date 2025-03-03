import { HealthController } from '@/health/health.controller';
import { HealthService } from '@/health/health.service';
import { HealthStatus } from '@/health/health-types';
import { vi } from 'vitest';

describe('HealthController', () => {
  let healthController: HealthController;
  let healthService: HealthService;

  beforeEach(async () => {
    healthService = {
      getLiveness: vi.fn(),
      getReadiness: vi.fn(),
    } as unknown as HealthService;

    healthController = new HealthController(healthService);
  });

  describe('getLiveness', () => {
    it('should return liveness status from healthService', async () => {
      const livenessStatus: HealthStatus = {
        status: 'UP',
        timestamp: new Date().toISOString(),
      };

      vi.spyOn(healthService, 'getLiveness').mockResolvedValueOnce(
        livenessStatus
      );

      const result = await healthController.getLiveness();

      expect(result).toEqual(livenessStatus);
      expect(healthService.getLiveness).toHaveBeenCalled();
    });
  });

  describe('getReadiness', () => {
    it('should return readiness status from healthService', async () => {
      const readinessStatus: HealthStatus = {
        status: 'UP',
        timestamp: new Date().toISOString(),
        details: {},
      };

      vi.spyOn(healthService, 'getReadiness').mockResolvedValueOnce(
        readinessStatus
      );

      const result = await healthController.getReadiness();

      expect(result).toEqual(readinessStatus);
      expect(healthService.getReadiness).toHaveBeenCalled();
    });
  });
});
