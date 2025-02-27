import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { PromptService } from '@/prompt/prompt.service';
import { CreatePromptDto } from '@/prompt/prompt-types/prompt.dto';
import { encrypt } from '@/config/crypto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

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
    type: CreatePromptDto,
  })
  async createPrompt(
    @Param('eventId') eventId: string,
    @Body() createDto: CreatePromptDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const createdPrompt = await this.promptService.createPrompt({
      ...createDto,
      eventId,
      userEmail: encrypt(createDto.userEmail, process.env.EMAIL_HASH_SECRET),
    });
    response.cookie('userId', createdPrompt.userId, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    return createdPrompt;
  }
}
