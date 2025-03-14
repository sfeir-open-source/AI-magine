import { Module } from '@nestjs/common';
import { HealthController } from '@/infrastructure/health/health.controller';
import { HealthService } from '@/infrastructure/health/health.service';

@Module({
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
