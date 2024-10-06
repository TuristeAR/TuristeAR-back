import { Weather } from '../entities/weather';
import { CreateWeatherDto } from '../../application/dtos/create-weather.dto';
import { WeatherRepository } from '../repositories/weather.repository';

export class WeatherService {
  private weatherRepository: WeatherRepository;

  constructor() {
    this.weatherRepository = new WeatherRepository();
  }

  create(createWeatherDto: CreateWeatherDto): Promise<Weather> {
    return this.weatherRepository.create(createWeatherDto);
  }

  findAll(): Promise<Weather[]> {
    return this.weatherRepository.findMany({});
  }

  findOneById(id: number): Promise<Weather | null> {
    return this.weatherRepository.findOne({ where: { id } });
  }
}
