import { PublicationRepository } from '../../../infrastructure/repositories/publication.repository';
import { PublicationRepositoryInterface } from '../../../domain/repositories/publication.repository.interface';
import { Publication } from '../../../domain/entities/publication';

export class FindPublicationByCategoryUseCase {
  private publicationRepository: PublicationRepositoryInterface;

  constructor() {
    this.publicationRepository = new PublicationRepository();
  }

  execute(categoryId: number): Promise<Publication[]> {
    return this.publicationRepository.findMany({
      where: { categories: { id: categoryId } },
      relations: ['user', 'categories', 'likes', 'reposts', 'saved', 'comments', 'activities.place'],
      order: { id: 'DESC' },
    });
  }
}
