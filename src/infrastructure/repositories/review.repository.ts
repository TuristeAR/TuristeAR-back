import { AbstractRepository } from './abstract.repository';
import { AppDataSource } from '../database/data-source';
import { Review } from '../../domain/entities/review';

export class ReviewRepository extends AbstractRepository<Review> {
  constructor() {
    super(AppDataSource.getRepository(Review));
  }
}
