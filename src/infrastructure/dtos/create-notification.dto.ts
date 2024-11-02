import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateNorificationDto {

    @IsString()
    description: string;

    @IsArray()
    @IsString({each: true})
    images: string[];

    @IsBoolean()
    isRead: boolean;

    @IsNumber()
    user: number;

}