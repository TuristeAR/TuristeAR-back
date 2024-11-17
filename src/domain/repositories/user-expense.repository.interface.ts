import { DeepPartial, DeleteResult, FindOneOptions } from 'typeorm';
import { UserExpense } from '../entities/user_expense';

export interface UserExpenseRepositoryInterface {
  create(data: DeepPartial<UserExpense>): Promise<UserExpense>;
  findOne(options: FindOneOptions<UserExpense>): Promise<UserExpense | null>;

  findMany(options: FindOneOptions<UserExpense>): Promise<UserExpense[]>;

  save(userExpense: UserExpense): Promise<UserExpense>;

  deleteOne(userExpenseId: number): Promise<DeleteResult>;

  deleteByExpenseId(expenseId: number): Promise<DeleteResult>;
}