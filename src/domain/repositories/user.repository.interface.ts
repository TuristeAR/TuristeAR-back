import { DeepPartial, FindOneOptions } from 'typeorm';
import { User } from '../entities/user';

export interface UserRepositoryInterface {
  create(data: DeepPartial<User>): Promise<User>;
  findOne(options: FindOneOptions<User>): Promise<User | null>;
  findMany(options: FindOneOptions<User>): Promise<User[]>;
  save(user: User): Promise<User>;
}
