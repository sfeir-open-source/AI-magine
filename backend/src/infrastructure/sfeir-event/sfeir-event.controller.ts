import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SfeirEventMappers } from '@/core/application/sfeir-event/mappers/sfeir-event.mappers';
import { CreateSfeirEventDto } from '@/core/application/sfeir-event/dto/create-sfeir-event.dto';
import {
  SFEIR_EVENT_SERVICE,
  SfeirEventService,
} from '@/core/application/sfeir-event/sfeir-event.service';
import { GetSfeirEventDto } from '@/core/application/sfeir-event/dto/get-sfeir-event.dtos';

@Controller('v1/events')
@ApiTags('sfeir-event')
export class SfeirEventController {
  constructor(
    @Inject(SFEIR_EVENT_SERVICE)
    private readonly sfeirEventService: SfeirEventService
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All events',
    type: GetSfeirEventDto,
    isArray: true,
  })
  async getSfeirEvents(): Promise<GetSfeirEventDto[]> {
    const storedEvents = await this.sfeirEventService.getSfeirEvents();

    return storedEvents.map((storedEvent) =>
      SfeirEventMappers.fromDomainToDTO(storedEvent)
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an event' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The event has been successfully created.',
    type: GetSfeirEventDto,
  })
  async createSfeirEvent(
    @Body() body: CreateSfeirEventDto
  ): Promise<GetSfeirEventDto> {
    const storedEvent = await this.sfeirEventService.createSfeirEvent(body);
    return SfeirEventMappers.fromDomainToDTO(storedEvent);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an event' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The event has been successfully deleted.',
  })
  async deleteSfeirEvent(@Param('id') id: string): Promise<void> {
    return this.sfeirEventService.deleteSfeirEvent(id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get an event' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The event was found.',
    type: GetSfeirEventDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The event could not be found.',
  })
  async getSfeirEvent(@Param('id') id: string): Promise<GetSfeirEventDto> {
    const storedEvent = await this.sfeirEventService.getSfeirEvent(id);

    if (!storedEvent) {
      throw new NotFoundException(`Event with id ${id} doest not exists.`);
    }
    return SfeirEventMappers.fromDomainToDTO(storedEvent);
  }

  @Get(':id/users')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users for an event' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All users for an event',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The event could not be found.',
  })
  async countEventUsers(@Param('id') eventId: string): Promise<number> {
    return this.sfeirEventService.countEventUsers(eventId);
  }

  @Get(':id/images')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all images for an event' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All images for an event',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The event could not be found.',
  })
  async countEventImages(@Param('id') eventId: string): Promise<number> {
    return this.sfeirEventService.countEventImages(eventId);
  }

  @Get(':id/prompt/generation-statuses/requests/count')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all generation requested for an event' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All generation requested for an event',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The event could not be found.',
  })
  async countEventGenerationRequested(@Param('id') eventId: string) {
    return this.sfeirEventService.countStatusByEvent(
      eventId,
      'image:generation-requested'
    );
  }

  @Get(':id/prompt/generation-statuses/done/count')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all generation done for an event' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All generation done for an event',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The event could not be found.',
  })
  async countEventGenerationDone(@Param('id') eventId: string) {
    return this.sfeirEventService.countStatusByEvent(eventId, 'done');
  }

  @Get(':id/prompt/generation-statuses/error/count')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all generation errored for an event' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All generation errored for an event',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The event could not be found.',
  })
  async countEventGenerationError(@Param('id') eventId: string) {
    return this.sfeirEventService.countStatusByEvent(eventId, 'error');
  }

  @Get(':id/users')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users for an event' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All users for an event',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
  })
  async getEventUsers(@Param('id') eventId: string) {
    return this.sfeirEventService.getEventUsers(eventId);
  }
}
