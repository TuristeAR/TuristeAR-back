import { DeepPartial, FindOneOptions, FindManyOptions, DeleteResult } from 'typeorm';
import { Expense } from '../entities/expense';

export interface ExpenseRepositoryInterface {
  create(data: DeepPartial<Expense>): Promise<Expense>;
  findOne(options: FindOneOptions<Expense>): Promise<Expense | null>;
  findMany(options?: FindManyOptions<Expense>): Promise<Expense[]>;
  save(expense: Expense): Promise<Expense>;
  deleteOne(id: number): Promise<DeleteResult>;
}