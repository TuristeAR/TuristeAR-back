import { DeepPartial, FindOneOptions, UpdateResult } from 'typeorm';
import { Activity } from '../entities/activity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Itinerary } from '../entities/itinerary';

export interface ActivityRepositoryInterface {
  create(data: DeepPartial<Activity>): Promise<Activity>;
  findOne(options: FindOneOptions<Activity>): Promise<Activity | null>;
  update(id: number, data: QueryDeepPartialEntity<Activity>): Promise<UpdateResult>;
  save(user: Activity): Promise<Activity>;

}
