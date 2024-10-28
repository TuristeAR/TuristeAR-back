import { UpdateResult } from 'typeorm';
import { Activity } from '../../../domain/entities/activity';
import { ActivityRepositoryInterface } from '../../../domain/repositories/activity.repository.interface';
import { ActivityRepository } from '../../../infrastructure/repositories/activity.repository';

export class UpdateDateActivityIdUseCase {
  private activityRepository: ActivityRepositoryInterface;

  constructor() {
    this.activityRepository = new ActivityRepository();
  }

  async update(activityId: number, updatedData: Partial<Activity>): Promise<UpdateResult> {
    return await this.activityRepository.update(activityId, updatedData);
  }
}
