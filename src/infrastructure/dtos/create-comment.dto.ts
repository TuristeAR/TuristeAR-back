import { IsNumber, IsString } from 'class-validator';


export class CreateCommentDto {
  @IsString()
  description: string;

  @IsNumber()
  publicationId : number;

  @IsNumber()
  userId: number;
}