import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SfeirEventService } from '@/events/sfeir-event.service';
import { CreateSfeirEventDto, SfeirEventDto } from '@/events/events-types';
import { SfeirEventMappers } from '@/events/events-types/sfeir-event.mappers';

@Controller('v1/events')
@ApiTags('sfeir-event')
export class SfeirEventController {
  constructor(private readonly sfeirEventService: SfeirEventService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All events',
    type: SfeirEventDto,
    isArray: true,
  })
  async getSfeirEvents(): Promise<SfeirEventDto[]> {
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
    type: SfeirEventDto,
  })
  async createSfeirEvent(
    @Body() body: CreateSfeirEventDto
  ): Promise<SfeirEventDto> {
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
    type: SfeirEventDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The event could not be found.',
  })
  async getSfeirEvent(@Param('id') id: string): Promise<SfeirEventDto> {
    const storedEvent = await this.sfeirEventService.getSfeirEvent(id);

    if (!storedEvent) {
      throw new UnprocessableEntityException(
        `Event with id ${id} doest not exists.`
      );
    }
    return SfeirEventMappers.fromDomainToDTO(storedEvent);
  }
}
