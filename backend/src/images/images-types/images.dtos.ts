import { ApiProperty } from '@nestjs/swagger';

export class ImageDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  prompt: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  selected: boolean;
}
