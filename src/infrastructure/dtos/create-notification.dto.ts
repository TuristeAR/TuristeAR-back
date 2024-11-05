import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateNorificationDto {

    @IsString()
    description: string;

    @IsBoolean()
    isRead: boolean;

    @IsNumber()
    user: number;

    @IsNumber()
    publication: number;

    @IsNumber()
    itinerary: number;

}