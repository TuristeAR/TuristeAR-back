import { Expense } from '../../../domain/entities/expense';
import { ExpenseRepositoryInterface } from '../../../domain/repositories/expense.repository.interface';
import { ExpenseRepository } from '../../../infrastructure/repositories/expense.repository';

export class FindExpensesByItineraryIdUseCases {
  private expenseRepository: ExpenseRepositoryInterface;

  constructor() {
    this.expenseRepository = new ExpenseRepository();
  }

  async execute(id: number): Promise<Expense[]> {
      return await this.expenseRepository.findMany({
      where: { itinerary: { id } },
      relations: [ 'payer', 'participatingUsers', 'userExpenses','userExpenses.user' ],
    });
  }
}
