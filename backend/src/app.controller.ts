import { Controller, Get } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Inject } from '@nestjs/common';
import { Logger as WinstonLogger } from 'winston';

@Controller()
export class AppController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger
  ) {}

  @Get('/test')
  test() {
    this.logger.info('Test log message', {
      context: 'AppController',
    });
    return 'Logger test';
  }
}
