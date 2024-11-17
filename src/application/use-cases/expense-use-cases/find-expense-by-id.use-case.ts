import { Expense } from "../../../domain/entities/expense";
import { ExpenseRepositoryInterface } from "../../../domain/repositories/expense.repository.interface";
import { ExpenseRepository } from "../../../infrastructure/repositories/expense.repository";

export class FindExpenseByIdUseCase {
    private expenseRepository: ExpenseRepositoryInterface;

    constructor() {
        this.expenseRepository = new ExpenseRepository();
    }

    async execute(id: number): Promise<Expense|null> {
        const expenses = await this.expenseRepository.findOne({
            where: { id: id },
            relations: [ 'payer', 'participatingUsers', 'userExpenses', 'userExpenses.user' ]
        });
        return expenses;
    }
}
