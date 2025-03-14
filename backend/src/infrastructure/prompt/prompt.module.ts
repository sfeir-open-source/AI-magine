import { Module } from '@nestjs/common';
import { PromptController } from '@/infrastructure/prompt/prompt.controller';
import { PromptServiceImpl } from '@/infrastructure/prompt/prompt.service.impl';
import { PROMPT_SERVICE } from '@/core/application/prompt/prompt.service';
import { PersistenceModule } from '@/infrastructure/shared/persistence/persistence.module';
import { SfeirEventModule } from '@/infrastructure/sfeir-event/sfeir-event.module';
import { UserModule } from '@/infrastructure/user/user.module';
import { ImageGenerationModule } from '@/infrastructure/shared/image-generation/image-generation.module';
import { ImageModule } from '@/infrastructure/image/image.module';

@Module({
  imports: [
    PersistenceModule,
    SfeirEventModule,
    UserModule,
    ImageModule,
    ImageGenerationModule,
  ],
  controllers: [PromptController],
  providers: [{ provide: PROMPT_SERVICE, useClass: PromptServiceImpl }],
})
export class PromptModule {}
