import { ActivityRepositoryInterface } from '../../../domain/repositories/activity.repository.interface';
import { CreateActivityDto } from '../../../infrastructure/dtos/create-activity.dto';
import { Activity } from '../../../domain/entities/activity';
import { ActivityRepository } from '../../../infrastructure/repositories/activity.repository';

export class CreateActivityUseCase {
  private activityRepository: ActivityRepositoryInterface;

  constructor() {
    this.activityRepository = new ActivityRepository();
  }

  execute(createActivityDto: CreateActivityDto): Promise<Activity> {
    return this.activityRepository.create(createActivityDto);
  }
}
