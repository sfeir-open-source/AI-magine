import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from './config/logger.config';
import { AppController } from './app.controller';
import { HealthModule } from './health/health.module';
import { SfeirEventModule } from '@/events/sfeir-event.module';
import * as path from 'node:path';
import { PromptModule } from '@/prompt/prompt.module';
import { UserModule } from '@/user/user.module';
import { ImageGenerationModule } from '@/image-generation/image-generation.module';
import { ImagesModule } from '@/images/images.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationModule } from '@/configuration/configuration.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    WinstonModule.forRoot(loggerConfig),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', '..', 'public'),
      serveRoot: '/static',
    }),
    HealthModule,
    ConfigurationModule,
    SfeirEventModule,
    UserModule,
    ImageGenerationModule,
    ImagesModule,
    PromptModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
