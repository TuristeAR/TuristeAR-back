import { IsArray, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';


export class CreateEventDTO {
    @IsString()
    name: string;

    @IsDate()
    fromDate: Date;

    @IsDate()
    toDate: Date;

    @IsNumber()
    province: number;

    @IsString()
    locality: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    image: string;

    
}