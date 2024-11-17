import { GetDebtByUserIdAndItineraryIdUseCase } from '../../application/use-cases/expense-use-cases/get-debt-by-user-id-and-itinerary.use-case';
import { GetDebtsForPayerUseCase } from '../../application/use-cases/expense-use-cases/get-debts-for-payer.use-case';
import { SettleDebtUseCase } from '../../application/use-cases/expense-use-cases/settle-debt.use-case';

export class ExpenseService {
  private getDebtByUserIdAndItineraryId: GetDebtByUserIdAndItineraryIdUseCase;
  private getDebtsForPayer: GetDebtsForPayerUseCase;
  private settleDebt: SettleDebtUseCase;

  constructor() {
    this.getDebtByUserIdAndItineraryId = new GetDebtByUserIdAndItineraryIdUseCase();
    this.getDebtsForPayer = new GetDebtsForPayerUseCase();
    this.settleDebt = new SettleDebtUseCase()
  }

  debtByUserId(userId: number, itineraryId: number) {
    return this.getDebtByUserIdAndItineraryId.execute(userId, itineraryId);
  }

  async getDebts(userId: number, itineraryId: number) {
    return await this.getDebtsForPayer.execute(Number(userId), Number(itineraryId));
  }
  async settle(userId: number, itineraryId: number) {
    return await this.settleDebt.execute(Number(userId), Number(itineraryId));
  }
}
