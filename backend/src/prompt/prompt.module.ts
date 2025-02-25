import { Module } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { PromptController } from './prompt.controller';
import { UserModule } from '@/user/user.module';
import { SQLiteClient } from '@/config/sqlite-client';
import { PROMPT_REPOSITORY } from '@/prompt/prompt-types';
import { SqlitePromptRepository } from '@/prompt/sqlite.prompt.repository';

@Module({
  imports: [UserModule],
  controllers: [PromptController],
  providers: [
    PromptService,
    SQLiteClient,
    {
      provide: PROMPT_REPOSITORY,
      useClass: SqlitePromptRepository,
    },
  ],
})
export class PromptModule {}
