import { AbstractRepository } from './abstract.repository';
import { AppDataSource } from '../database/data-source';
import { Weather } from '../../domain/entities/weather';
import { WeatherRepositoryInterface } from '../../domain/repositories/weather.repository.interface';

export class WeatherRepository
  extends AbstractRepository<Weather>
  implements WeatherRepositoryInterface
{
  constructor() {
    super(AppDataSource.getRepository(Weather));
  }
}
