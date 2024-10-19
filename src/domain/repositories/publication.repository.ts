import { AbstractRepository } from '../../infrastructure/repositories/abstract.repository';
import { AppDataSource } from '../../infrastructure/database/data-source';
import { Publication } from '../entities/publication';

export class PublicationRepository extends AbstractRepository<Publication> {
  constructor() {
    super(AppDataSource.getRepository(Publication));
  }
}
