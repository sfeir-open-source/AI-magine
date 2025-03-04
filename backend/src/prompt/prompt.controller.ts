import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  Sse,
} from '@nestjs/common';
import { PromptService } from '@/prompt/prompt.service';
import { CreatePromptBodyDto } from '@/prompt/prompt-types/prompt.dto';
import { encrypt } from '@/config/crypto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Observable, Subject } from 'rxjs';
import { ImageGenerationMessageEvent } from '@/image-generation/image-generation-types';

@Controller('v1/events/:eventId/prompts')
export class PromptController {
  constructor(private readonly promptService: PromptService) {}

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
  async createPrompt(
    @Param('eventId') eventId: string,
    @Body() createDto: CreatePromptBodyDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const userEmail = encrypt(
      createDto.userEmail,
      process.env.EMAIL_HASH_SECRET
    );
    const createdPrompt = await this.promptService.createPrompt({
      ...createDto,
      eventId,
      userEmail,
    });
    response.cookie('userId', createdPrompt.userId, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return createdPrompt;
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
