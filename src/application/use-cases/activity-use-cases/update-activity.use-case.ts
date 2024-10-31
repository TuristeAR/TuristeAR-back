import { ActivityRepositoryInterface } from '../../../domain/repositories/activity.repository.interface';
import { ActivityRepository } from '../../../infrastructure/repositories/activity.repository';
import { Activity } from '../../../domain/entities/activity';

export class UpdateActivityUseCase {
  private activityRepository: ActivityRepositoryInterface;

  constructor() {
    this.activityRepository = new ActivityRepository();
  }

  execute(activity: Activity): Promise<Activity> {
    return this.activityRepository.save(activity);
  }
}
