import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  googleId: string;

  @IsString()
  publishedTime: string;

  @IsNumber()
  rating: number;

  @IsString()
  text: string;

  @IsString()
  authorName: string;

  @IsString()
  authorPhoto: string;

  @IsString({ each: true })
  @IsArray()
  photos: string[];
}
