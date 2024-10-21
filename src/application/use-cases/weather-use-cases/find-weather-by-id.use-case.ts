import { Weather } from '../../../domain/entities/weather';
import { WeatherRepositoryInterface } from '../../../domain/repositories/weather.repository.interface';
import { WeatherRepository } from '../../../infrastructure/repositories/weather.repository';

export class FindWeatherByIdUseCase {
  private weatherRepository: WeatherRepositoryInterface;

  constructor() {
    this.weatherRepository = new WeatherRepository();
  }

  execute(id: number): Promise<Weather | null> {
    return this.weatherRepository.findOne({ where: { id } });
  }
}
