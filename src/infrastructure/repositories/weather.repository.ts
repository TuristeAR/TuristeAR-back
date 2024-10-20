import { AbstractRepository } from './abstract.repository';
import { AppDataSource } from '../database/data-source';
import { Weather } from '../../domain/entities/weather';

export class WeatherRepository extends AbstractRepository<Weather> {
  constructor() {
    super(AppDataSource.getRepository(Weather));
  }
}
