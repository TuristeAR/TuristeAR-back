import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {

  @IsString()
  content: string;

  @IsArray()
  @IsString({each: true})
  images: string[];

  @IsNumber()
  user: number;
}
