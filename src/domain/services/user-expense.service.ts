import { CreateUserExpenseUseCase } from "../../application/use-cases/user-expense-use-cases/create-user-expense.use-case";
import { DeleteUserExpenseUseCase } from "../../application/use-cases/user-expense-use-cases/delete-user-expense.use-case";
import { UpdateUserExpenseUseCase } from "../../application/use-cases/user-expense-use-cases/update-user-expense.use-case";
import { UserExpense } from "../entities/user_expense";

export class UserExpenseService {
    private createUserExpenseUserCase: CreateUserExpenseUseCase;
    private updateUserExpenseUseCase: UpdateUserExpenseUseCase;
    private deleteUserExpenseUseCase: DeleteUserExpenseUseCase;

    constructor(){
        this.createUserExpenseUserCase = new CreateUserExpenseUseCase();
        this.updateUserExpenseUseCase = new UpdateUserExpenseUseCase();
        this.deleteUserExpenseUseCase = new DeleteUserExpenseUseCase()
    }

    createUserExpense(userExpense: UserExpense): Promise<UserExpense> {
        return this.createUserExpenseUserCase.execute(userExpense);
    }
    updateUserExpense(userExpense: UserExpense): Promise<UserExpense|null>{
        return this.updateUserExpenseUseCase.execute(userExpense)
    }
    deleteUserExpense(userExpenseId: number){
        this.deleteUserExpenseUseCase.execute(userExpenseId)
    }
}