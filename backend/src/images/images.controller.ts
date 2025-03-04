import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ImagesService } from '@/images/images.service';

@Controller('/v1/events/:eventId/users/:userId/images')
@ApiTags('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get user images on specific event',
  })
  async getUserEventImages(
    @Param('eventId') eventId: string,
    @Param('userId') userId: string
  ) {
    return this.imagesService.getImagesByEventAndUser(eventId, userId);
  }
}
