import { Province } from '../../../domain/entities/province';
import { ProvinceRepositoryInterface } from '../../../domain/repositories/province.repository.interface';
import { ProvinceRepository } from '../../../infrastructure/repositories/province.repository';

export class FindProvinceWithReviewsUseCase {
  private provinceRepository: ProvinceRepositoryInterface;

  constructor() {
    this.provinceRepository = new ProvinceRepository();
  }

  execute(isId: boolean, idNumber: number, identifier: string | number): Promise<Province | null> {
    return this.provinceRepository.findOne({
      where: isId ? { id: idNumber } : { name: String(identifier) },

      relations: ['places', 'places.reviews'],
      select: {
        id: true,
        name: true,
        description: true,
        images: true,
        places: {
          id: true,
          name: true,
          reviews: {
            authorName: true,
            authorPhoto: true,
            publishedTime: true,
            photos: true,
            rating: true,
            text: true,
          },
        },
      },
    });
  }
}
