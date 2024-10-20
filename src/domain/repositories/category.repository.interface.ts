import { FindOneOptions } from 'typeorm';
import { Category } from '../entities/category';

export interface CategoryRepositoryInterface {
  findOne(options: FindOneOptions<Category>): Promise<Category | null>;
  findMany(options: FindOneOptions<Category>): Promise<Category[]>;
}
