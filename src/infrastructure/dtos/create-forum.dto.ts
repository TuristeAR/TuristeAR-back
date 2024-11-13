import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateForumDto {

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @IsNumber()
  messages : number[];

  @IsNumber()
  categoryId : number;

  @IsNumber()
  userId : number;

  @IsBoolean()
  isPublic : boolean;


}
