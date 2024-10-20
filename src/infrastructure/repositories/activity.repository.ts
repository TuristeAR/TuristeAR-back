import { AbstractRepository } from './abstract.repository';
import { Activity } from '../../domain/entities/activity';
import { AppDataSource } from '../database/data-source';
import { ActivityRepositoryInterface } from '../../domain/repositories/activity.repository.interface';

export class ActivityRepository
  extends AbstractRepository<Activity>
  implements ActivityRepositoryInterface
{
  constructor() {
    super(AppDataSource.getRepository(Activity));
  }
}
