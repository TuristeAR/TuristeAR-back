import { UpdateActivityUseCase } from '../../../../src/application/use-cases/activity-use-cases/update-activity.use-case';
import { ActivityRepository } from '../../../../src/infrastructure/repositories/activity.repository';
import { Activity } from '../../../../src/domain/entities/activity';

describe('UpdateActivityUseCase', () => {
  let updateActivityUseCase: UpdateActivityUseCase;
  let activityRepository: jest.Mocked<ActivityRepository>;

  beforeEach(() => {
    activityRepository = {
      save: jest.fn(),
    } as unknown as jest.Mocked<ActivityRepository>;
    updateActivityUseCase = new UpdateActivityUseCase();
    (updateActivityUseCase as any).activityRepository = activityRepository;
  });

  it('should update activity successfully', async () => {
    const activity: Activity = { id: 1 } as Activity;
    jest.spyOn(activityRepository, 'save').mockResolvedValue(activity);

    const result = await updateActivityUseCase.execute(activity);

    expect(result).toEqual(activity);
    expect(activityRepository.save).toHaveBeenCalledWith(activity);
  });
});
