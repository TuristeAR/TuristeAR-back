import { IsString } from 'class-validator';

export class CreateCultureDto {
    @IsString()
    title: string;

    @IsString()
    images: string;
    
    @IsString()
    description: string;
}