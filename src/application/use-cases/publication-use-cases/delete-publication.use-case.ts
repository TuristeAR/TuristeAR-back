import { PublicationRepositoryInterface } from '../../../domain/repositories/publication.repository.interface';
import { Publication } from '../../../domain/entities/publication';
import { PublicationRepository } from '../../../infrastructure/repositories/publication.repository';
import { DeleteResult } from 'typeorm';

export class DeletePublicationUseCase {
  private publicationRepository: PublicationRepositoryInterface;

  constructor() {
    this.publicationRepository = new PublicationRepository();
  }

  execute(publication: Publication): Promise<DeleteResult> {
    return this.publicationRepository.deleteOne(publication.id);
  }
}
