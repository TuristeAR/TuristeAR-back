import { UserExpense } from "../../../domain/entities/user_expense";
import { UserExpenseRepositoryInterface } from "../../../domain/repositories/user-expense.repository.interface";
import { UserExpenseRepository } from "../../../infrastructure/repositories/user-expense.repository";

export class UpdateUserExpenseUseCase {
    private userExpenseRepository: UserExpenseRepositoryInterface;

    constructor() {
        this.userExpenseRepository = new UserExpenseRepository();
    }

    async execute(userExpense: UserExpense): Promise<UserExpense|null> {
        const saveUserExpense = await this.userExpenseRepository.save(userExpense);
        return saveUserExpense;
    }
}
