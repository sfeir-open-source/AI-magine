import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ImagesService } from '@/images/images.service';

@Controller('/v1/events/:eventId/users/:userId/images')
@ApiTags('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  async getUserEventImages(
    @Param('eventId') eventId: string,
    @Param('userId') userId: string
  ) {
    const prompts = await this.imagesService.getImagesByEventAndUser(
      eventId,
      userId
    );
    return Promise.resolve(prompts);
  }
}
