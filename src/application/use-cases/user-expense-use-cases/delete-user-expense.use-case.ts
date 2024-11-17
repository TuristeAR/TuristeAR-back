import { CommentRepositoryInterface } from '../../../domain/repositories/comment.repository.interface';
import { CommentRepository } from '../../../infrastructure/repositories/comment.repository';
import { Comment } from '../../../domain/entities/comment';
import { DeleteResult } from 'typeorm';
import { ActivityRepositoryInterface } from '../../../domain/repositories/activity.repository.interface';
import { ActivityRepository } from '../../../infrastructure/repositories/activity.repository';
import { Activity } from '../../../domain/entities/activity';
import { ExpenseRepositoryInterface } from '../../../domain/repositories/expense.repository.interface';
import { ExpenseRepository } from '../../../infrastructure/repositories/expense.repository';
import { Expense } from '../../../domain/entities/expense';
import { UserExpenseRepositoryInterface } from '../../../domain/repositories/user-expense.repository.interface';
import { UserExpenseRepository } from '../../../infrastructure/repositories/user-expense.repository';

export class DeleteUserExpenseUseCase {
  private userExpenseRepository: UserExpenseRepositoryInterface;

  constructor() {
    this.userExpenseRepository = new UserExpenseRepository();
  }

  execute(userExpenseId : number): Promise<DeleteResult> {
    return this.userExpenseRepository.deleteOne(userExpenseId);
  }
}
