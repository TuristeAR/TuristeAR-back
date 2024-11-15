import { FindOneOptions } from 'typeorm';
import { Type } from '../entities/type';

export interface TypeRepositoryInterface {
  findMany(options: FindOneOptions<Type>): Promise<Type[]>;
}
