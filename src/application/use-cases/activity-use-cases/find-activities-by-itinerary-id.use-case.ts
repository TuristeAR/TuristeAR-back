import { Activity } from '../../../domain/entities/activity';
import { ActivityRepositoryInterface } from '../../../domain/repositories/activity.repository.interface';
import { ActivityRepository } from '../../../infrastructure/repositories/activity.repository';

export class FindActivitiesByItineraryIdUseCase {
  private activityRepository: ActivityRepositoryInterface;

  constructor() {
    this.activityRepository = new ActivityRepository();
  }

  execute(id: number): Promise<Activity[] | null> {
    return this.activityRepository.findMany({
      where: { itinerary:{ id: id} },
      relations: ['place.province']
    });
  }
}
