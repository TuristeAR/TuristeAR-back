import { Review } from '../entities/review';
import { ReviewRepository } from '../repositories/review.repository';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { get, getWithoutJson } from '../utils/http.util';

export class ReviewService {
  private reviewRepository: ReviewRepository;

  constructor() {
    this.reviewRepository = new ReviewRepository();
  }

  create(createReviewDto: CreateReviewDto): Promise<Review> {
    return this.reviewRepository.create(createReviewDto);
  }

  findAll(): Promise<Review[]> {
    return this.reviewRepository.findMany({});
  }

  findOneByGoogleId(googleId: string): Promise<Review | null> {
    return this.reviewRepository.findOne({ where: { googleId } });
  }

  async fetchReviews(googleId: string) {
    try {
      let reviews: any[] = [];
      let reviewPhotos: any[] = [];

      const searchUrl = `https://places.googleapis.com/v1/places/${googleId}`;

      const searchHeaders = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_API_KEY as string,
        'X-Goog-FieldMask': 'reviews,photos',
      };

      const results = await get(searchUrl, searchHeaders);

      if (results.reviews) {
        reviews.push(...results.reviews);

        reviews.sort(
          (a: any, b: any) => new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime(),
        );
      }

      for (const photo of results.photos) {
        const photoUrl = `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=1280`;

        const photoHeaders = {
          'X-Goog-Api-Key': process.env.GOOGLE_API_KEY as string,
        };

        const photoResponse = await getWithoutJson(photoUrl, photoHeaders);

        reviewPhotos.push(photoResponse.url);
      }

      reviewPhotos = reviewPhotos.reduce((acc, url, index) => {
        const i = Math.floor(index / 2);
        if (!acc[i]) acc[i] = [];
        acc[i].push(url);
        return acc;
      }, []);

      for (const review of reviews) {
        /*const isInSpanish = await post(
          'http://localhost:5000/analyze',
          {
            'Content-Type': 'application/json',
          },
          { q: review.originalText.text },
        );

        if (isInSpanish.result === true) {
          */
        const createReviewDto: CreateReviewDto = {
          googleId: googleId as string,
          publishedTime: review.relativePublishTimeDescription,
          rating: review.rating,
          text: review.originalText.text,
          authorName: review.authorAttribution.displayName,
          authorPhoto: review.authorAttribution.photoUri,
          photos: reviewPhotos.shift() || null,
        };

        await this.create(createReviewDto);
        //}
      }
    } catch (error) {
      console.error('Error fetching reviews', error);
    }
  }
}
