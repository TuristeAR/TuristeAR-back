import { ExpenseRepository } from '../../../infrastructure/repositories/expense.repository';
import { ExpenseRepositoryInterface } from '../../../domain/repositories/expense.repository.interface';
import { FindUserExpenseByIdUseCase } from '../user-expense-use-cases/find-user-expense-by-id.use-case';
import { UpdateUserExpenseUseCase } from '../user-expense-use-cases/update-user-expense.use-case';

export class SettleDebtUseCase {
  private expenseRepository: ExpenseRepositoryInterface;

  constructor() {
    this.expenseRepository = new ExpenseRepository();
  }

  async execute(userId: number, itineraryId: number): Promise<void> {
    const expenses = await this.expenseRepository.findMany({
      where: {
        itinerary: { id: itineraryId },
      },
      relations: ['userExpenses', 'userExpenses.user'],
    });

    if (expenses.length === 0) {
      throw new Error('No hay deudas registradas para este usuario en este itinerario');
    }

    const updateUserExpenseUseCase = new UpdateUserExpenseUseCase();

    for (const expense of expenses) {
      for (const userExpense of expense.userExpenses) {
        if (userExpense.user.id === userId) {
          userExpense.isPaid = true;
          await updateUserExpenseUseCase.execute(userExpense); 
        }
      }
    }
  }
}
