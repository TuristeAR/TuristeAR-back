import { Review } from '../../../domain/entities/review';
import { ReviewRepositoryInterface } from '../../../domain/repositories/review.repository.interface';
import { ReviewRepository } from '../../../infrastructure/repositories/review.repository';

export class FindReviewByGoogleIdUseCase {
  private reviewRepository: ReviewRepositoryInterface;

  constructor() {
    this.reviewRepository = new ReviewRepository();
  }

  execute(googleId: string): Promise<Review | null> {
    return this.reviewRepository.findOne({
      where: {
        place: { googleId },
      },
      relations: ['place'],
    });
  }
}
