import { Weather } from '../../../domain/entities/weather';
import { WeatherRepositoryInterface } from '../../../domain/repositories/weather.repository.interface';
import { WeatherRepository } from '../../../infrastructure/repositories/weather.repository';

export class FindAllWeatherUseCase {
  private weatherRepository: WeatherRepositoryInterface;

  constructor() {
    this.weatherRepository = new WeatherRepository();
  }

  execute(): Promise<Weather[]> {
    return this.weatherRepository.findMany({});
  }
}
