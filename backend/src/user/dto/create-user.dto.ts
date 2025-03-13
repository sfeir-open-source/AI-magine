import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    name: 'userEmail',
    description: 'Email of the user',
  })
  userEmail: string;

  @ApiProperty({
    name: 'userNickname',
    description: 'Nickname of the user',
  })
  userNickname: string;

  @ApiProperty({
    name: 'allowContact',
    description: 'Did the user allow us to contact him',
  })
  allowContact: boolean;

  @ApiProperty({
    name: 'browserFingerprint',
    description: "Fingerprint of the user's browser",
  })
  browserFingerprint: string;
}
