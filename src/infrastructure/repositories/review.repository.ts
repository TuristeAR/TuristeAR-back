import { AbstractRepository } from './abstract.repository';
import { AppDataSource } from '../database/data-source';
import { Review } from '../../domain/entities/review';
import { ReviewRepositoryInterface } from '../../domain/repositories/review.repository.interface';

export class ReviewRepository
  extends AbstractRepository<Review>
  implements ReviewRepositoryInterface
{
  constructor() {
    super(AppDataSource.getRepository(Review));
  }
}
