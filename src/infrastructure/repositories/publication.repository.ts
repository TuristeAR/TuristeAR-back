import { AbstractRepository } from './abstract.repository';
import { AppDataSource } from '../database/data-source';
import { Publication } from '../../domain/entities/publication';

export class PublicationRepository extends AbstractRepository<Publication> {
  constructor() {
    super(AppDataSource.getRepository(Publication));
  }
}
