import { IsString } from 'class-validator';

export class CreateWeatherDto {
  @IsString()
  name: string;
}
