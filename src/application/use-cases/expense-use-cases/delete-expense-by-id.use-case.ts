import { DeleteResult } from "typeorm";
import { Expense } from "../../../domain/entities/expense";
import { ExpenseRepositoryInterface } from "../../../domain/repositories/expense.repository.interface";
import { ExpenseRepository } from "../../../infrastructure/repositories/expense.repository";
import { UserExpenseRepositoryInterface } from "../../../domain/repositories/user-expense.repository.interface";
import { UserExpenseRepository } from "../../../infrastructure/repositories/user-expense.repository";

export class DeleteExpensesByIdUseCases {
    private expenseRepository: ExpenseRepositoryInterface;
    private userExpenseRepository: UserExpenseRepositoryInterface;

    constructor() {
        this.userExpenseRepository = new UserExpenseRepository();
        this.expenseRepository = new ExpenseRepository()
    }

    async execute(id: number): Promise<DeleteResult> {
        this.userExpenseRepository.deleteByExpenseId(id)
        return this.expenseRepository.deleteOne(id);   
    }
}
