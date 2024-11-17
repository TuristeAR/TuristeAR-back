import { UpdateResult } from 'typeorm';
import { UpdateDateActivityIdUseCase } from '../../../../src/application/use-cases/activity-use-cases/update-date-activity-id.use-case';
import { ActivityRepository } from '../../../../src/infrastructure/repositories/activity.repository';

describe('UpdateDateActivityIdUseCase', () => {
  let updateDateActivityIdUseCase: UpdateDateActivityIdUseCase;
  let activityRepository: jest.Mocked<ActivityRepository>;

  beforeEach(() => {
    activityRepository = {
      update: jest.fn(),
    } as unknown as jest.Mocked<ActivityRepository>;
    updateDateActivityIdUseCase = new UpdateDateActivityIdUseCase();
    (updateDateActivityIdUseCase as any).activityRepository = activityRepository;
  });

  it('should update activity date successfully', async () => {
    const updateResult: UpdateResult = { affected: 1 } as UpdateResult;
    jest.spyOn(activityRepository, 'update').mockResolvedValue(updateResult);

    const result = await updateDateActivityIdUseCase.update(1, {
      fromDate: new Date(),
      toDate: new Date(),
    });

    expect(result).toEqual(updateResult);
    expect(activityRepository.update).toHaveBeenCalledWith(1, {
      fromDate: expect.any(Date),
      toDate: expect.any(Date),
    });
  });

  it('should handle no affected rows', async () => {
    const updateResult: UpdateResult = { affected: 0 } as UpdateResult;
    jest.spyOn(activityRepository, 'update').mockResolvedValue(updateResult);

    const result = await updateDateActivityIdUseCase.update(1, {
      fromDate: new Date(),
      toDate: new Date(),
    });

    expect(result).toEqual(updateResult);
    expect(activityRepository.update).toHaveBeenCalledWith(1, {
      fromDate: expect.any(Date),
      toDate: expect.any(Date),
    });
  });
});
