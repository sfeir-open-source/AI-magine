import { Module } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { PromptController } from './prompt.controller';
import { UserModule } from '@/user/user.module';
import { SQLiteClient } from '@/config/sqlite-client';
import { PROMPT_REPOSITORY } from '@/prompt/domain';
import { SqlitePromptRepository } from '@/prompt/sqlite.prompt.repository';
import { ImageGenerationModule } from '@/image-generation/image-generation.module';
import { ImageGenerationEngine } from '@/image-generation/image-generation.engine';
import { IMAGE_GENERATION_STATUS_REPOSITORY } from '@/image-generation/domain';
import { SqliteImageGenerationStatusRepository } from '@/image-generation/sqlite.image-generation-status.repository';
import { IMAGES_REPOSITORY } from '@/images/domain/images.repository';
import { SqliteImagesRepository } from '@/images/sqlite.images.repository';
import { ImagesModule } from '@/images/images.module';

@Module({
  imports: [UserModule, ImageGenerationModule, ImagesModule],
  controllers: [PromptController],
  providers: [
    PromptService,
    SQLiteClient,
    ImageGenerationEngine,
    {
      provide: PROMPT_REPOSITORY,
      useClass: SqlitePromptRepository,
    },
    {
      provide: IMAGE_GENERATION_STATUS_REPOSITORY,
      useClass: SqliteImageGenerationStatusRepository,
    },
    {
      provide: IMAGES_REPOSITORY,
      useClass: SqliteImagesRepository,
    },
  ],
})
export class PromptModule {}
