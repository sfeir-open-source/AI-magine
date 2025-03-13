import { HealthService } from '@/infrastructure/health/health.service';
import { HealthStatusDto } from '@/infrastructure/health/get-health-status.dto';

describe('HealthService', () => {
  const healthService = new HealthService();

  describe('getLiveness', () => {
    it('should return a health status with status "UP" and a valid timestamp', async () => {
      const result: HealthStatusDto = await healthService.getLiveness();

      expect(result).toHaveProperty('status', 'UP');
      expect(result).toHaveProperty('timestamp');
      expect(new Date(result.timestamp).toString()).not.toBe('Invalid Date');
    });
  });

  describe('getReadiness', () => {
    it('should return a health status with status "UP", a valid timestamp, and an empty details object', async () => {
      const result: HealthStatusDto = await healthService.getReadiness();

      expect(result).toHaveProperty('status', 'UP');
      expect(result).toHaveProperty('timestamp');
      expect(new Date(result.timestamp).toString()).not.toBe('Invalid Date');
      expect(result).toHaveProperty('details', {});
    });
  });
});
