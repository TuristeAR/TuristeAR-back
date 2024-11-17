import { Expense } from "../../../domain/entities/expense";
import { UserExpense } from "../../../domain/entities/user_expense";
import { UserExpenseRepositoryInterface } from "../../../domain/repositories/user-expense.repository.interface";
import { UserExpenseRepository } from "../../../infrastructure/repositories/user-expense.repository";

export class FindUserExpenseByIdUseCase {
    private userExpenseRepository: UserExpenseRepositoryInterface;

    constructor() {
        this.userExpenseRepository = new UserExpenseRepository();
    }

    async execute(userExpense: number): Promise<UserExpense|null> {
        const ue = await this.userExpenseRepository.findOne({where: {id:userExpense}});
        return ue;
    }
}
