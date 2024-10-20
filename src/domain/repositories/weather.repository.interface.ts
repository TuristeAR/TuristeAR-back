import { DeepPartial, FindOneOptions } from 'typeorm';
import { Weather } from '../entities/weather';

export interface WeatherRepositoryInterface {
  create(data: DeepPartial<Weather>): Promise<Weather>;
  findOne(options: FindOneOptions<Weather>): Promise<Weather | null>;
  findMany(options: FindOneOptions<Weather>): Promise<Weather[]>;
}
