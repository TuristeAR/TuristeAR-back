import { DeepPartial, FindOneOptions, FindManyOptions, DeleteResult, UpdateResult } from 'typeorm';
import { Expense } from '../entities/expense';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface ExpenseRepositoryInterface {
  create(data: DeepPartial<Expense>): Promise<Expense>;
  findOne(options: FindOneOptions<Expense>): Promise<Expense | null>;
  findMany(options?: FindManyOptions<Expense>): Promise<Expense[]>;
  save(expense: Expense): Promise<Expense>;
  deleteOne(id: number): Promise<DeleteResult>;
  update(id: number, data: QueryDeepPartialEntity<Expense>): Promise<UpdateResult>;
}