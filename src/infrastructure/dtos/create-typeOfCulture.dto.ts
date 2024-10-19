import { IsString } from 'class-validator';

export class CreateTypeOfCultureDto {
    @IsString()
    type: string;
}