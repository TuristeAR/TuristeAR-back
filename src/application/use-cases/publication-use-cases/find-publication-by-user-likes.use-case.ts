import { PublicationRepository } from '../../../infrastructure/repositories/publication.repository';
import { PublicationRepositoryInterface } from '../../../domain/repositories/publication.repository.interface';
import { Publication } from '../../../domain/entities/publication';

export class FindPublicationByUserLikesUseCase {
  private publicationRepository: PublicationRepositoryInterface;

  constructor() {
    this.publicationRepository = new PublicationRepository();
  }

  execute(userId: number): Promise<Publication[]> {
    return this.publicationRepository.findPublicationsByLikes(userId);
  }
}
