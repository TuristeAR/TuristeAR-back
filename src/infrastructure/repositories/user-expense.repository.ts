import { AbstractRepository } from './abstract.repository';
import { AppDataSource } from '../database/data-source';
import { UserExpenseRepositoryInterface } from '../../domain/repositories/user-expense.repository.interface';
import { UserExpense } from '../../domain/entities/user_expense';
import { DeleteResult, Repository } from 'typeorm';

export class UserExpenseRepository
  extends AbstractRepository<UserExpense>
  implements UserExpenseRepositoryInterface
{

  constructor() {
    super(AppDataSource.getRepository(UserExpense));

  }
  async deleteByExpenseId(expenseId: number): Promise<DeleteResult> {
    try {
      return await this.repository.delete({ expense: { id: expenseId } });
    } catch (error) {
      throw new Error(`Error al eliminar UserExpenses por expenseId: ${(error as Error).message}`);
    }  }

}