import { CommentRepositoryInterface } from '../../../domain/repositories/comment.repository.interface';
import { CommentRepository } from '../../../infrastructure/repositories/comment.repository';
import { Comment } from '../../../domain/entities/comment';
import { DeleteResult } from 'typeorm';
import { ActivityRepositoryInterface } from '../../../domain/repositories/activity.repository.interface';
import { ActivityRepository } from '../../../infrastructure/repositories/activity.repository';
import { Activity } from '../../../domain/entities/activity';

export class DeleteActivitiesUseCase {
  private activityRepository: ActivityRepositoryInterface;

  constructor() {
    this.activityRepository = new ActivityRepository();
  }

  execute(activities: Activity[]): Promise<DeleteResult> {
    return this.activityRepository.deleteMany(activities.map(activity => activity.id));
  }
}
