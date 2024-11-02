import { ReviewRepositoryInterface } from '../../../domain/repositories/review.repository.interface';
import { CreateReviewDto } from '../../../infrastructure/dtos/create-review.dto';
import { Review } from '../../../domain/entities/review';
import { ReviewRepository } from '../../../infrastructure/repositories/review.repository';

export class CreateReviewUseCase {
  private reviewRepository: ReviewRepositoryInterface;

  constructor() {
    this.reviewRepository = new ReviewRepository();
  }

  execute(createReviewDto: CreateReviewDto): Promise<Review> {
    return this.reviewRepository.create(createReviewDto);
  }
}
