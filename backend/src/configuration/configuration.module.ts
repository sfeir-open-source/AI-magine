import { Global, Module } from '@nestjs/common';
import { ConfigurationService } from '@/configuration/configuration.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
