import { FindActivitiesByItineraryIdUseCase } from '../../../../src/application/use-cases/activity-use-cases/find-activities-by-itinerary-id.use-case';
import { Activity } from '../../../../src/domain/entities/activity';
import { ActivityRepositoryInterface } from '../../../../src/domain/repositories/activity.repository.interface';

describe('FindActivitiesByItineraryIdUseCase', () => {
  let findActivitiesByItineraryIdUseCase: FindActivitiesByItineraryIdUseCase;
  let activityRepository: jest.Mocked<ActivityRepositoryInterface>;

  beforeEach(() => {
    activityRepository = {
      findMany: jest.fn(),
    } as unknown as jest.Mocked<ActivityRepositoryInterface>;
    findActivitiesByItineraryIdUseCase = new FindActivitiesByItineraryIdUseCase();
    (findActivitiesByItineraryIdUseCase as any).activityRepository = activityRepository;
  });

  it('should find activities by itinerary id successfully', async () => {
    const activities: Activity[] = [{ id: 1 }, { id: 2 }] as Activity[];
    jest.spyOn(activityRepository, 'findMany').mockResolvedValue(activities);

    const result = await findActivitiesByItineraryIdUseCase.execute(1);

    expect(result).toEqual(activities);
    expect(activityRepository.findMany).toHaveBeenCalledWith({
      where: { itinerary: { id: 1 } },
      relations: ['place.province'],
    });
  });

  it('should return empty array if no activities found', async () => {
    jest.spyOn(activityRepository, 'findMany').mockResolvedValue([]);

    const result = await findActivitiesByItineraryIdUseCase.execute(1);

    expect(result).toEqual([]);
    expect(activityRepository.findMany).toHaveBeenCalledWith({
      where: { itinerary: { id: 1 } },
      relations: ['place.province'],
    });
  });
});
