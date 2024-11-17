import { UserExpense } from '../../../domain/entities/user_expense';
import { UserExpenseRepositoryInterface } from '../../../domain/repositories/user-expense.repository.interface';
import { UserExpenseRepository } from '../../../infrastructure/repositories/user-expense.repository';
import { DeleteResult } from 'typeorm';

export class DeleteUserExpenseByExpenseIdUseCase {
  private userExpenseRepository: UserExpenseRepositoryInterface;

  constructor() {
    this.userExpenseRepository = new UserExpenseRepository();
  }

  async execute(expenseId: number) {
    await this.userExpenseRepository.deleteByExpenseId(expenseId);
  }
}
