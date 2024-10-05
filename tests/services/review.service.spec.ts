import { CreateReviewDto } from '../../src/dtos/create-review.dto';
import { ReviewRepository } from '../../src/repositories/review.repository';
import { ReviewService } from '../../src/services/review.service';
import { Review } from '../../src/entities/review';

jest.mock('../../src/repositories/review.repository');

describe('ReviewService', () => {
  let reviewService: ReviewService;
  let reviewRepository: jest.Mocked<ReviewRepository>;

  beforeEach(() => {
    reviewRepository = new ReviewRepository() as jest.Mocked<ReviewRepository>;
    reviewService = new ReviewService();
    (reviewService as any).reviewRepository = reviewRepository;
  });

  it('creates a new review', async () => {
    const createReviewDto: CreateReviewDto = {
      googleId: 'some-google-id',
      publishedTime: 'some-published-time',
      rating: 5,
      text: 'some-text',
      authorName: 'some-author-name',
      authorPhoto: 'some-author-photo',
      photos: ['photo1', 'photo2'],
    };

    await reviewService.create(createReviewDto);

    expect(reviewRepository.create).toHaveBeenCalledWith(createReviewDto);
  });

  it('finds all reviews', async () => {
    const reviews = [{ id: 1, text: 'Test Review' }] as Review[];

    reviewRepository.findMany.mockResolvedValue(reviews);

    const result = await reviewService.findAll();

    expect(result).toEqual(reviews);
    expect(reviewRepository.findMany).toHaveBeenCalledWith({});
  });

  it('finds a review by googleId', async () => {
    const review: Review = {
      id: 1,
      createdAt: new Date(),
      googleId: 'some-google-id',
      publishedTime: 'some-published-time',
      rating: 5,
      text: 'some-text',
      authorName: 'some-author-name',
      authorPhoto: 'some-author-photo',
      photos: ['photo1', 'photo2'],
    };

    reviewRepository.findOne.mockResolvedValue(review);

    const result = await reviewService.findOneByGoogleId('1');

    expect(result).toEqual(review);
    expect(reviewRepository.findOne).toHaveBeenCalledWith({ where: { googleId: '1' } });
  });

  it('returns null if review not found by googleId', async () => {
    reviewRepository.findOne.mockResolvedValue(null);

    const result = await reviewService.findOneByGoogleId('999');

    expect(result).toBeNull();
    expect(reviewRepository.findOne).toHaveBeenCalledWith({ where: { googleId: '999' } });
  });
});