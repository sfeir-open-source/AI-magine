import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Sse,
} from '@nestjs/common';
import { CreatePromptBodyDto } from '@/core/application/prompt/dto/create-prompt.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Observable, Subject } from 'rxjs';
import { ImageGenerationMessageEvent } from '@/core/application/image-generation/image-generation-message-event';
import {
  PROMPT_SERVICE,
  PromptService,
} from '@/core/application/prompt/prompt.service';

@Controller('v1/events/:eventId/prompts')
export class PromptController {
  constructor(
    @Inject(PROMPT_SERVICE)
    private readonly promptService: PromptService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiTags('prompts')
  @ApiOperation({
    summary: 'Create a prompt',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The prompt has been successfully created.',
    type: CreatePromptBodyDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The prompt could not be created.',
  })
  async createPrompt(
    @Param('eventId') eventId: string,
    @Body() createDto: CreatePromptBodyDto
  ) {
    return this.promptService.createPrompt({
      ...createDto,
      eventId,
    });
  }

  @Sse(':promptId')
  @HttpCode(HttpStatus.OK)
  @ApiTags('prompts')
  @ApiOperation({
    summary: 'Get a prompt status',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The prompt status.',
  })
  getPromptStatus(
    @Param('eventId') eventId: string,
    @Param('promptId') promptId: string
  ): Observable<ImageGenerationMessageEvent> {
    const progress = new Subject<ImageGenerationMessageEvent>();

    this.promptService.getGenerationStatus(promptId, progress);

    return progress.asObservable();
  }
}
