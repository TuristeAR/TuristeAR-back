import { AbstractRepository } from './abstract.repository';
import { AppDataSource } from '../database/data-source';
import { Publication } from '../../domain/entities/publication';
import { PublicationRepositoryInterface } from '../../domain/repositories/publication.repository.interface';

export class PublicationRepository
  extends AbstractRepository<Publication>
  implements PublicationRepositoryInterface
{
  constructor() {
    super(AppDataSource.getRepository(Publication));
  }
}
