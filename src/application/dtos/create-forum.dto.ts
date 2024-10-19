import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateForumDto {

  @IsNumber()
  place: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @IsNumber()
  messages : number[];
}
