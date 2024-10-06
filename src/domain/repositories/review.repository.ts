import { AbstractRepository } from '../../utils/abstract.repository';
import { AppDataSource } from '../../data-source';
import { Review } from '../entities/review';

export class ReviewRepository extends AbstractRepository<Review> {
  constructor() {
    super(AppDataSource.getRepository(Review));
  }
}
