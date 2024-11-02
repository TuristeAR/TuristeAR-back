import { DeepPartial, FindOneOptions } from 'typeorm';
import { Place } from '../entities/place';

export interface PlaceRepositoryInterface {
  create(data: DeepPartial<Place>): Promise<Place>;
  findOne(options: FindOneOptions<Place>): Promise<Place | null>;
  findMany(options: FindOneOptions<Place>, limit: number | undefined): Promise<Place[]>;
  
}
