import { DeepPartial, FindOneOptions } from 'typeorm';
import { Activity } from '../entities/activity';

export interface ActivityRepositoryInterface {
  create(data: DeepPartial<Activity>): Promise<Activity>;
  findOne(options: FindOneOptions<Activity>): Promise<Activity | null>;
}
