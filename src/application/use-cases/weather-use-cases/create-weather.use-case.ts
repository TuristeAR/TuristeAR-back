import { CreateWeatherDto } from '../../../infrastructure/dtos/create-weather.dto';
import { Weather } from '../../../domain/entities/weather';
import { WeatherRepository } from '../../../infrastructure/repositories/weather.repository';
import { WeatherRepositoryInterface } from '../../../domain/repositories/weather.repository.interface';

export class CreateWeatherUseCase {
  private weatherRepository: WeatherRepositoryInterface;

  constructor() {
    this.weatherRepository = new WeatherRepository();
  }

  execute(createWeatherDto: CreateWeatherDto): Promise<Weather> {
    return this.weatherRepository.create(createWeatherDto);
  }
}
