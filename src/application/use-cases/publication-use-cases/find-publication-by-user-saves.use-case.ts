import { PublicationRepository } from '../../../infrastructure/repositories/publication.repository';
import { PublicationRepositoryInterface } from '../../../domain/repositories/publication.repository.interface';
import { Publication } from '../../../domain/entities/publication';

export class FindPublicationByUserSavesUseCase {
  private publicationRepository: PublicationRepositoryInterface;

  constructor() {
    this.publicationRepository = new PublicationRepository();
  }

  execute(userId: number): Promise<Publication[]> {
    return this.publicationRepository.findMany({
      where: { saved: { id: userId } },
      relations: ['user', 'category', 'likes', 'reposts', 'saved'],
      order: { id: 'DESC' },
    });
  }
}
