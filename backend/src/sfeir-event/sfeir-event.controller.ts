import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SfeirEventService } from './sfeir-event.service';
import { CreateSfeirEventDto, SfeirEventDto } from './types';

@Controller('sfeir-event')
@ApiTags('sfeir-event')
export class SfeirEventController {
  constructor(private readonly sfeirEventService: SfeirEventService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({
    status: 200,
    description: 'All events',
    type: SfeirEventDto,
    isArray: true,
  })
  async getSfeirEvents(): Promise<
    ReturnType<SfeirEventService['getSfeirEvents']>
  > {
    return this.sfeirEventService.getSfeirEvents();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an event' })
  @ApiResponse({
    status: 201,
    description: 'The event has been successfully created.',
    type: SfeirEventDto,
  })
  async createSfeirEvent(
    @Body() body: CreateSfeirEventDto
  ): Promise<ReturnType<SfeirEventService['createSfeirEvent']>> {
    return this.sfeirEventService.createSfeirEvent(body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.MOVED_PERMANENTLY)
  @ApiOperation({ summary: 'Delete an event' })
  @ApiResponse({
    status: 200,
    description: 'The event has been successfully deleted.',
    type: SfeirEventDto,
  })
  async deleteSfeirEvent(
    @Param('id') id: string
  ): Promise<ReturnType<SfeirEventService['deleteSfeirEvent']>> {
    return this.sfeirEventService.deleteSfeirEvent(id);
  }
}
