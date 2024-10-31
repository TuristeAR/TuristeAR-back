import { DeleteResult } from "typeorm";
import { Expense } from "../../../domain/entities/expense";
import { ExpenseRepositoryInterface } from "../../../domain/repositories/expense.repository.interface";
import { ExpenseRepository } from "../../../infrastructure/repositories/expense.repository";

export class DeleteExpensesByIdUseCases {
    private expenseRepository: ExpenseRepositoryInterface;

    constructor() {
        this.expenseRepository = new ExpenseRepository();
    }

    async execute(id: number): Promise<DeleteResult> {
        return this.expenseRepository.deleteOne(id);   
    }
}
