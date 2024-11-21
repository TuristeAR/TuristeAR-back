import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNorificationDto {

    @IsString()
    description: string;

    @IsBoolean()
    isRead: boolean;

    @IsNumber()
    user: number;

    @IsOptional()
    @IsNumber()
    publication?: number;

    @IsOptional()
    @IsNumber()
    comment?: number;

    @IsOptional()
    @IsNumber()
    participationRequest?: number;

    @IsOptional()
    @IsNumber()
    itinerary?: number;

}