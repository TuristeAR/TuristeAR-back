import { AbstractRepository } from '../../utils/abstract.repository';
import { AppDataSource } from '../../infrastructure/database/data-source';
import { Publication } from '../entities/publication';
import { User } from '../entities/user';

export class PublicationRepository extends AbstractRepository<Publication> {

  constructor() {
    super(AppDataSource.getRepository(Publication));
  }
}
