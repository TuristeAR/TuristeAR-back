import { UserExpense } from '../../../domain/entities/user_expense';
import { UserExpenseRepositoryInterface } from '../../../domain/repositories/user-expense.repository.interface';
import { UserExpenseRepository } from '../../../infrastructure/repositories/user-expense.repository';

export class CreateUserExpenseUseCase {
  private userRepository: UserExpenseRepositoryInterface;

  constructor() {
    this.userRepository = new UserExpenseRepository();
  }

  execute(userExpense: UserExpense): Promise<UserExpense> {
    return this.userRepository.create(userExpense);
  }
}
