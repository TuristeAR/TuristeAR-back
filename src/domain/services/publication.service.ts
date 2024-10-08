import { PublicationRepository } from '../repositories/publication.repository';
import { Publication } from '../entities/publication';

export class PublicationService {

  private publicationRepository: PublicationRepository;

  constructor() {
    this.publicationRepository = new PublicationRepository();
  }

  findForUser(id : number): Promise<Publication[] | null> {
    return this.publicationRepository.findForUser(id);
  }

}