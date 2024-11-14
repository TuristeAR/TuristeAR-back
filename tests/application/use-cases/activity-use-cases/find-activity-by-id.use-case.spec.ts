import { FindActivityByIdUseCase } from '../../../../src/application/use-cases/activity-use-cases/find-activity-by-id.use-case';
import { ActivityRepository } from '../../../../src/infrastructure/repositories/activity.repository';
import { Activity } from '../../../../src/domain/entities/activity';

describe('FindActivityByIdUseCase', () => {
  let findActivityByIdUseCase: FindActivityByIdUseCase;
  let activityRepository: jest.Mocked<ActivityRepository>;

  beforeEach(() => {
    activityRepository = {
      findOne: jest.fn(),
    } as unknown as jest.Mocked<ActivityRepository>;
    findActivityByIdUseCase = new FindActivityByIdUseCase();
    (findActivityByIdUseCase as any).activityRepository = activityRepository;
  });

  it('should find activity by id successfully', async () => {
    const activity: Activity = { id: 1 } as Activity;
    jest.spyOn(activityRepository, 'findOne').mockResolvedValue(activity);

    const result = await findActivityByIdUseCase.execute(1);

    expect(result).toEqual(activity);
    expect(activityRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['place.province.category'],
    });
  });

  it('should return null if activity not found', async () => {
    jest.spyOn(activityRepository, 'findOne').mockResolvedValue(null);

    const result = await findActivityByIdUseCase.execute(1);

    expect(result).toBeNull();
    expect(activityRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['place.province.category'],
    });
  });
});
