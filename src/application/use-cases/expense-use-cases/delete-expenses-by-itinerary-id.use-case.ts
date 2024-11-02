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

export class DeleteExpensesByItineraryIdUseCase {
  private expenseRepository: ExpenseRepositoryInterface;

  constructor() {
    this.expenseRepository = new ExpenseRepository();
  }

  execute(expenses : Expense[]): Promise<DeleteResult> {
    return this.expenseRepository.deleteMany(expenses.map(expense => expense.id));
  }
}
