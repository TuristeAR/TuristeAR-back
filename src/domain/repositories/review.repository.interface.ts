import { DeepPartial, FindOneOptions } from 'typeorm';
import { Review } from '../entities/review';

export interface ReviewRepositoryInterface {
  create(data: DeepPartial<Review>): Promise<Review>;
  findOne(options: FindOneOptions<Review>): Promise<Review | null>;
  findMany(options: FindOneOptions<Review>): Promise<Review[]>;
}
