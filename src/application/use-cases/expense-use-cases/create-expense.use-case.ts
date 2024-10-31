import { Expense } from '../../../domain/entities/expense';
import { ExpenseRepositoryInterface } from '../../../domain/repositories/expense.repository.interface';
import { ExpenseRepository } from '../../../infrastructure/repositories/expense.repository';

export class CreateExpenseUseCase {
  private expenseRepository: ExpenseRepositoryInterface;

  constructor() {
    this.expenseRepository = new ExpenseRepository();
  }

 async execute(data: Expense): Promise<Expense | null> {
    const expense =  this.expenseRepository.create(data);
    return expense;
  }
}
