import { PublicationRepositoryInterface } from '../../../domain/repositories/publication.repository.interface';
import { Publication } from '../../../domain/entities/publication';
import { PublicationRepository } from '../../../infrastructure/repositories/publication.repository';

export class CreatePublicationUseCase {
  private publicationRepository: PublicationRepositoryInterface;

  constructor() {
    this.publicationRepository = new PublicationRepository();
  }

  execute(publication: Publication): Promise<Publication> {
    return this.publicationRepository.save(publication);
  }
}
