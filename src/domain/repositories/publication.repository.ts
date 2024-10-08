import { AbstractRepository } from '../../utils/abstract.repository';
import { AppDataSource } from '../../infrastructure/database/data-source';
import { Publication } from '../entities/publication';

export class PublicationRepository extends AbstractRepository<Publication> {

  constructor() {
    super(AppDataSource.getRepository(Publication));
  }

  findForUser(id: number) {
    return this.repository.find({
      where: { user: { id } }
    });
  }

}
