import { DeepPartial, FindOneOptions } from 'typeorm';
import { Province } from '../entities/province';

export interface ProvinceRepositoryInterface {
  create(data: DeepPartial<Province>): Promise<Province>;
  findOne(options: FindOneOptions<Province>): Promise<Province | null>;
  findMany(options: FindOneOptions<Province>): Promise<Province[]>;
}
