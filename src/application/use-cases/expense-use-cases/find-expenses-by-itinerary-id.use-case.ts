import { Expense } from "../../../domain/entities/expense";
import { ExpenseRepositoryInterface } from "../../../domain/repositories/expense.repository.interface";
import { ExpenseRepository } from "../../../infrastructure/repositories/expense.repository";

export class FindExpensesByItineraryIdUseCases {
    private expenseRepository: ExpenseRepositoryInterface;

    constructor() {
        this.expenseRepository = new ExpenseRepository();
    }

    async execute(id: number): Promise<Expense[]> {
        const expenses = await this.expenseRepository.findMany({
            where: { itinerary: {id} },
            relations: { payer: true, participatingUsers: true }
        });
        return expenses;
    }
}
