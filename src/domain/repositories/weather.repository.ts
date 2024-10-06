import { AbstractRepository } from '../../utils/abstract.repository';
import { AppDataSource } from '../../infrastructure/database/data-source';
import { Weather } from '../entities/weather';

export class WeatherRepository extends AbstractRepository<Weather> {
  constructor() {
    super(AppDataSource.getRepository(Weather));
  }
}
