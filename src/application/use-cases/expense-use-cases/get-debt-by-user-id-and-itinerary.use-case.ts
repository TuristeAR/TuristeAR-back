import { Not } from 'typeorm';
import { ExpenseRepositoryInterface } from '../../../domain/repositories/expense.repository.interface';
import { ExpenseRepository } from '../../../infrastructure/repositories/expense.repository';

export class GetDebtByUserIdAndItineraryIdUseCase {
  private expenseRepository: ExpenseRepositoryInterface;

  constructor() {
    this.expenseRepository = new ExpenseRepository();
  }

  async execute(
    userId: number,
    itineraryId: number,
  ): Promise<{
    totalDebt: number;
    debtsByPayer: Array<{
      payerId: number;
      name: string;
      profilePicture: string;
      amount: number;
    }>;
  }> {
    const expenses = await this.expenseRepository.findMany({
      where: {
        itinerary: { id: itineraryId },
        participatingUsers: { id: userId },
        payer: { id: Not(userId) },
      },
      relations: ['participatingUsers', 'payer', 'userExpenses', 'userExpenses.user'], // Relaciones necesarias
    });

    let totalDebt: number = 0;
    const debtsByPayer: Record<number, { name: string; profilePicture: string; amount: number }> =
      {};

    expenses.forEach((expense) => {
      expense.userExpenses.forEach((userExpense) => {
        if (userExpense.user.id == userId) {
          const userAmount: number = Number(userExpense.amount);

          totalDebt += userAmount;
          const payer = expense.payer;
          if (!debtsByPayer[payer.id]) {
            debtsByPayer[payer.id] = {
              name: payer.name,
              profilePicture: payer.profilePicture,
              amount: 0,
            };
          }
          debtsByPayer[payer.id].amount += userAmount;
        }
      });
    });

    const debtsByPayerArray = Object.entries(debtsByPayer).map(([payerId, data]) => ({
      payerId: Number(payerId),
      name: data.name,
      profilePicture: data.profilePicture,
      amount: data.amount,
    }));

    return { totalDebt, debtsByPayer: debtsByPayerArray };
  }
}
