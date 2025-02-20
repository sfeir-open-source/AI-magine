import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { WinstonModule } from 'nest-winston';
import { loggerConfig } from './config/logger.config';
import { AppController } from './app.controller';
import { HealthModule } from './health/health.module';
import {SfeirEventModule} from "./sfeir-event/sfeir-event.module";
import * as path from "node:path";

@Module({
  imports: [
    WinstonModule.forRoot(loggerConfig),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', '..', 'public'),
      serveRoot: '/static',
    }),
    HealthModule,
    SfeirEventModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
