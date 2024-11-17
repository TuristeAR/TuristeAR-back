import { Expense } from '../../../domain/entities/expense';
import { UserExpense } from '../../../domain/entities/user_expense';
import { ExpenseRepositoryInterface } from '../../../domain/repositories/expense.repository.interface';
import { ExpenseRepository } from '../../../infrastructure/repositories/expense.repository';

export class GetDebtsForPayerUseCase {
  private expenseRepository: ExpenseRepositoryInterface;

  constructor() {
    this.expenseRepository = new ExpenseRepository();
  }

  async execute(
    userId: number,
    itineraryId: number,
  ): Promise<{
    totalDebt: number;
    totalPaid: number;
    debtsByPayer: Array<{
      payerId: number;
      name: string;
      profilePicture: string;
      amount: number;
    }>;
  }> {
    if (!userId || !itineraryId) {
      throw new Error('Parámetros inválidos: userId e itineraryId son requeridos');
    }

    try {
      const expenses = await this.expenseRepository.findMany({
        where: { itinerary: { id: itineraryId } },
        relations: ['userExpenses', 'userExpenses.user', 'payer'],
      });

      let totalDebt = 0;
      let totalPaid = 0;
      const debtsByParticipant: Record<
        number,
        { name: string; profilePicture: string; amount: number; paid: number }
      > = {};

      const expensePayer: Expense[] = expenses.filter((e: Expense) => e.payer.id === userId);
      expensePayer.forEach((expense) => {
        // Filtrar UserExpenses relacionados con el usuario actual
          const participantsDebt: UserExpense[] = expense.userExpenses.filter(
            (ue) => ue.user.id !== userId,
          );

          participantsDebt.forEach((participantExpense) => {
            const participant = participantExpense.user;
            if (!debtsByParticipant[participant.id]) {
              debtsByParticipant[participant.id] = {
                name: participant.name,
                profilePicture: participant.profilePicture,
                amount: 0,
                paid: 0,
              };
            }
            debtsByParticipant[participant.id].amount += !participantExpense.isPaid
              ? Number(participantExpense.amount)
              : 0;
            debtsByParticipant[participant.id].paid += participantExpense.isPaid
              ? Number(participantExpense.amount)
              : 0;
          });
        
        expense.userExpenses.forEach((userExpense) => {
          if(userId!=userExpense.user.id){
            if (userExpense.isPaid) {
            totalPaid += Number(userExpense.amount);
          } else {
            totalDebt += Number(userExpense.amount);
          }
          }
          
        });

      });

      const debtsByParticipantArray = Object.entries(debtsByParticipant).map(
        ([participantId, data]) => ({
          payerId: Number(participantId),
          name: data.name,
          profilePicture: data.profilePicture,
          amount: data.amount,
          paid: data.paid,
        }),
      );

      return { totalDebt, totalPaid, debtsByPayer: debtsByParticipantArray };
    } catch (error) {
      console.error('Error al obtener los gastos:', error);
      throw new Error('No se pudieron calcular las deudas');
    }
  }
}
