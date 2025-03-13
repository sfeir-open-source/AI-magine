import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { User } from '@/user/domain';
import { UserService } from '@/user/user.service';
import { Response } from 'express';
import { RemainingPromptsDto } from '@/user/dto/remaining-prompts.dto';

@Controller('v1/users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user or return an existing one' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully created.',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'An existing user was returned without any new user created.',
    type: User,
  })
  async createUser(@Body() body: CreateUserDto, @Res() response: Response) {
    const existingUser = await this.userService.getUserByEmail(body.userEmail);

    if (!existingUser) {
      const user = await this.userService.create(
        User.create({
          email: body.userEmail,
          browserFingerprint: body.browserFingerprint,
          allowContact: body.allowContact,
          nickname: body.userNickname,
        })
      );
      return response.status(HttpStatus.CREATED).json(user);
    }

    return response.status(HttpStatus.OK).json(existingUser);
  }

  @Get(':userId/events/:eventId/prompts/remaining')
  @ApiOperation({
    summary: 'Get the remaining number of prompts for a user and an event',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The remaining number of prompts for a user and an event',
    type: RemainingPromptsDto,
  })
  async getRemainingPrompts(
    @Param('userId') userId: string,
    @Param('eventId') eventId: string
  ) {
    return this.userService.getUserRemainingPromptsByEvent(userId, eventId);
  }
}
