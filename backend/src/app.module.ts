import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { HealthModule } from '@/infrastructure/health/health.module';
import { SfeirEventModule } from '@/infrastructure/sfeir-event/sfeir-event.module';
import * as path from 'node:path';
import { PromptModule } from '@/infrastructure/prompt/prompt.module';
import { UserModule } from '@/infrastructure/user/user.module';
import { ImageGenerationModule } from '@/infrastructure/shared/image-generation/image-generation.module';
import { ImageModule } from '@/infrastructure/image/image.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationModule } from '@/infrastructure/shared/configuration/configuration.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', '..', 'public'),
      serveRoot: '/static',
    }),
    ConfigurationModule,
    HealthModule,
    ImageModule,
    PromptModule,
    SfeirEventModule,
    UserModule,
    ImageGenerationModule,
  ],
})
export class AppModule {}
