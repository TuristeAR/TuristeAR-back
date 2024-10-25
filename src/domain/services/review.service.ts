import { CreateReviewDto } from '../../infrastructure/dtos/create-review.dto';
import { get, getWithoutJson } from '../utils/http.util';
import { CreateReviewUseCase } from '../../application/use-cases/review-use-cases/create-review.use-case';

export class ReviewService {
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
        const createReviewDto: CreateReviewDto = {
          googleId: googleId,
          publishedTime: review.relativePublishTimeDescription,
          rating: review.rating,
          text: review.originalText.text,
          authorName: review.authorAttribution.displayName,
          authorPhoto: review.authorAttribution.photoUri,
          photos: reviewPhotos.shift() || null,
        };

        const createReviewUseCase = new CreateReviewUseCase();

        await createReviewUseCase.execute(createReviewDto);
      }
    } catch (error) {
      console.error('Error fetching reviews', error);
    }
  }
}
