import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { Expense } from "../../../domain/entities/expense";
import { ExpenseRepositoryInterface } from "../../../domain/repositories/expense.repository.interface";
import { ExpenseRepository } from "../../../infrastructure/repositories/expense.repository";
import { UpdateResult } from "typeorm";

export class SaveExpenseUseCase {
    private expenseRepository: ExpenseRepositoryInterface;

    constructor() {
        this.expenseRepository = new ExpenseRepository();
    }

    async execute(data: Expense){
        return this.expenseRepository.save(data);
    }
}