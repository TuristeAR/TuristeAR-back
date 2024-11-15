import { PublicationRepositoryInterface } from '../../../domain/repositories/publication.repository.interface';
import { PublicationRepository } from '../../../infrastructure/repositories/publication.repository';
import { DeleteResult, In } from 'typeorm';


export class DeletePublicationsByActivitiesUseCase {
  private publicationRepository: PublicationRepositoryInterface;

  constructor() {
    this.publicationRepository = new PublicationRepository();
  }

  async execute(publicationIds: number[]): Promise<DeleteResult | null> {
    return this.publicationRepository.deleteMany(publicationIds);
  }



}
