import { CreateActivityUseCase } from '../../../../src/application/use-cases/activity-use-cases/create-activity.use-case';
import { ActivityRepositoryInterface } from '../../../../src/domain/repositories/activity.repository.interface';
import { CreateActivityDto } from '../../../../src/infrastructure/dtos/create-activity.dto';
import { Activity } from '../../../../src/domain/entities/activity';
import { Itinerary } from '../../../../src/domain/entities/itinerary';
import { Place } from '../../../../src/domain/entities/place';

describe('CreateActivityUseCase', () => {
  let createActivityUseCase: CreateActivityUseCase;
  let activityRepository: jest.Mocked<ActivityRepositoryInterface>;

  beforeEach(() => {
    activityRepository = {
      create: jest.fn(),
    } as unknown as jest.Mocked<ActivityRepositoryInterface>;
    createActivityUseCase = new CreateActivityUseCase();
    (createActivityUseCase as any).activityRepository = activityRepository;
  });

  it('should create an activity successfully', async () => {
    const createActivityDto: CreateActivityDto = {
      name: 'New Activity',
      itinerary: new Itinerary(),
      place: new Place(),
      fromDate: new Date(),
      toDate: new Date(),
      images: ['image1.jpg'],
    };
    const createdActivity: Activity = {
      id: 1,
      name: 'New Activity',
      itinerary: new Itinerary(),
      place: new Place(),
      fromDate: new Date(),
      toDate: new Date(),
      images: ['image1.jpg'],
      createdAt: new Date(),
    };
    activityRepository.create.mockResolvedValue(createdActivity);

    const result = await createActivityUseCase.execute(createActivityDto);

    expect(result).toEqual(createdActivity);
    expect(activityRepository.create).toHaveBeenCalledWith(createActivityDto);
  });

  it('should throw an error if activity creation fails', async () => {
    const createActivityDto: CreateActivityDto = {
      name: 'New Activity',
      itinerary: new Itinerary(),
      place: new Place(),
      fromDate: new Date(),
      toDate: new Date(),
      images: ['image1.jpg'],
    };
    activityRepository.create.mockRejectedValue(new Error('Creation failed'));

    await expect(createActivityUseCase.execute(createActivityDto)).rejects.toThrow(
      'Creation failed',
    );
    expect(activityRepository.create).toHaveBeenCalledWith(createActivityDto);
  });
});
