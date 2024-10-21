import { ReviewRepository } from '../../../infrastructure/repositories/review.repository';
import { ReviewRepositoryInterface } from '../../../domain/repositories/review.repository.interface';
import { Review } from '../../../domain/entities/review';

export class FindAllReviewUseCase {
  private reviewRepository: ReviewRepositoryInterface;

  constructor() {
    this.reviewRepository = new ReviewRepository();
  }

  execute(): Promise<Review[]> {
    return this.reviewRepository.findMany({});
  }
}
