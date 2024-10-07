import {
  Repository,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  ObjectLiteral,
  UpdateResult,
  DeleteResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class AbstractRepository<T extends ObjectLiteral> {
  protected constructor(protected readonly repository: Repository<T>) {}

  create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  findMany(options: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  update(id: number, data: QueryDeepPartialEntity<T>): Promise<UpdateResult> {
    return this.repository.update(id, data);
  }

  deleteOne(id: number): Promise<DeleteResult> {
    return this.repository.delete(id);
  }

  deleteMany(criteria: any): Promise<DeleteResult> {
    return this.repository.delete(criteria);
  }

  save(entity: DeepPartial<T>): Promise<T> {
    return this.repository.save(entity);
  }
}
