import { Module } from '@nestjs/common';
import { SfeirEventController } from './sfeir-event.controller';
import { SfeirEventService } from './sfeir-event.service';

@Module({
  controllers: [SfeirEventController],
  providers: [SfeirEventService],
})
export class SfeirEventModule {}
