import { PublicationRepository } from '../../../infrastructure/repositories/publication.repository';
import { PublicationRepositoryInterface } from '../../../domain/repositories/publication.repository.interface';
import { Publication } from '../../../domain/entities/publication';

export class FindPublicationByIdUseCase {
  private publicationRepository: PublicationRepositoryInterface;

  constructor() {
    this.publicationRepository = new PublicationRepository();
  }

  execute(id: number): Promise<Publication | null> {
    return this.publicationRepository.findOne({
      where: { id: id },
      relations: ['user', 'category', 'likes', 'reposts', 'saved', 'comments.user'],
    });
  }
}
