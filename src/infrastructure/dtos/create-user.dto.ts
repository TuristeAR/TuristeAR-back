import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsString()
  profilePicture: string;

  @IsString()
  googleId: string;

  @IsString()
  location: string;
}
