import { AbstractRepository } from './abstract.repository';
import { AppDataSource } from '../database/data-source';
import { Expense } from '../../domain/entities/expense';
import { ExpenseRepositoryInterface } from '../../domain/repositories/expense.repository.interface';
import { DeleteResult, FindManyOptions } from 'typeorm';

export class ExpenseRepository
  extends AbstractRepository<Expense>
  implements ExpenseRepositoryInterface
{
  constructor() {
    super(AppDataSource.getRepository(Expense));
  }
}