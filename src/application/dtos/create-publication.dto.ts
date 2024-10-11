import { User } from '../../domain/entities/user';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { Category } from '../../domain/entities/category';

export class CreatePublicationDTO {
  @IsString()
  description: string;
  @IsArray()
  @IsString({ each: true })
  images: string[];
  @IsString()
  creationDate: string;
  category : Category;
  user: User;
  @IsNumber()
  likes: number;
}