import { AbstractRepository } from '../../utils/abstract.repository';
import { Activity } from '../entities/activity';
import { AppDataSource } from '../../infrastructure/database/data-source';

export class ActivityRepository extends AbstractRepository<Activity> {
  constructor() {
    super(AppDataSource.getRepository(Activity));
  }

  findByItineraryId(itineraryId: number): Activity[] | PromiseLike<Activity[]> {
    throw new Error('Method not implemented.');
  }
  
}
