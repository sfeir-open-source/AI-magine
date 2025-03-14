import { Module } from '@nestjs/common';
import { SfeirEventController } from '@/infrastructure/sfeir-event/sfeir-event.controller';
import { SFEIR_EVENT_SERVICE } from '@/core/application/sfeir-event/sfeir-event.service';
import { SfeirEventServiceImpl } from '@/infrastructure/sfeir-event/sfeir-event.service.impl';
import { PersistenceModule } from '@/infrastructure/shared/persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  controllers: [SfeirEventController],
  providers: [
    { provide: SFEIR_EVENT_SERVICE, useClass: SfeirEventServiceImpl },
  ],
  exports: [SFEIR_EVENT_SERVICE],
})
export class SfeirEventModule {}
