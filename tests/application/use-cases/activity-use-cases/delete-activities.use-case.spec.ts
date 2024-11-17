import { DeleteActivitiesUseCase } from '../../../../src/application/use-cases/activity-use-cases/delete-activities.use-case';
import { Activity } from '../../../../src/domain/entities/activity';
import { ActivityRepository } from '../../../../src/infrastructure/repositories/activity.repository';
import { DeleteResult } from 'typeorm';

describe('DeleteActivitiesUseCase', () => {
  let deleteActivitiesUseCase: DeleteActivitiesUseCase;
  let activityRepository: jest.Mocked<ActivityRepository>;

  beforeEach(() => {
    activityRepository = {
      deleteMany: jest.fn(),
    } as unknown as jest.Mocked<ActivityRepository>;
    deleteActivitiesUseCase = new DeleteActivitiesUseCase();
    (deleteActivitiesUseCase as any).activityRepository = activityRepository;
  });

  it('should delete activities successfully', async () => {
    const activities: Activity[] = [{ id: 1 }, { id: 2 }] as Activity[];
    const deleteResult: DeleteResult = { affected: 2 } as DeleteResult;
    jest.spyOn(activityRepository, 'deleteMany').mockResolvedValue(deleteResult);

    const result = await deleteActivitiesUseCase.execute(activities);

    expect(result).toEqual(deleteResult);
    expect(activityRepository.deleteMany).toHaveBeenCalledWith([1, 2]);
  });

  it('should handle empty activities array', async () => {
    const activities: Activity[] = [];
    const deleteResult: DeleteResult = { affected: 0 } as DeleteResult;
    jest.spyOn(activityRepository, 'deleteMany').mockResolvedValue(deleteResult);

    const result = await deleteActivitiesUseCase.execute(activities);

    expect(result).toEqual(deleteResult);
    expect(activityRepository.deleteMany).toHaveBeenCalledWith([]);
  });
});
