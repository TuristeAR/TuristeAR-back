import { Review } from '../../../domain/entities/review';
import { ReviewRepositoryInterface } from '../../../domain/repositories/review.repository.interface';
import { ReviewRepository } from '../../../infrastructure/repositories/review.repository';

export class FindReviewByPlaceIdUseCase {
  private reviewRepository: ReviewRepositoryInterface;

  constructor() {
    this.reviewRepository = new ReviewRepository();
  }

  execute(googleId: string): Promise<Review[]> {
    return this.reviewRepository.findMany({
      where: { place: { googleId: googleId } },
      order: { rating: 'DESC' },
    });
  }
}
