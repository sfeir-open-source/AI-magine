import { Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ImagesService } from '@/images/images.service';

@Controller('/v1/events/:eventId/users/:userId/images')
@ApiTags('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  @ApiTags('images')
  @ApiOperation({
    summary: 'Get user images on specific event',
  })
  async getUserEventImages(
    @Param('eventId') eventId: string,
    @Param('userId') userId: string
  ) {
    return this.imagesService.getImagesByEventAndUser(eventId, userId);
  }

  @Patch(':imageId/promote')
  @ApiTags('images')
  @ApiOperation({
    summary: 'Promote image',
  })
  async promoteImage(
    @Param('eventId')
    eventId: string,
    @Param('userId')
    userId: string,
    @Param('imageId')
    imageId: string
  ) {
    return this.imagesService.promoteImage(eventId, userId, imageId);
  }
}
