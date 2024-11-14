import { FindEventByIdUseCase } from '../../../../src/application/use-cases/event-use-cases/find-event-by-id.use-case';
import { EventRepositoryInterface } from '../../../../src/domain/repositories/event.repository.interface';
import { Event } from '../../../../src/domain/entities/event';

describe('FindEventByIdUseCase', () => {
  let findEventByIdUseCase: FindEventByIdUseCase;
  let mockEventRepository: jest.Mocked<EventRepositoryInterface>;

  beforeEach(() => {
    mockEventRepository = {
      findOne: jest.fn(),
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    } as jest.Mocked<EventRepositoryInterface>;
    findEventByIdUseCase = new FindEventByIdUseCase();
    (findEventByIdUseCase as any).eventRepository = mockEventRepository;
  });

  it('finds event by id successfully', async () => {
    const event: Event = { id: 1, name: 'Test Event' } as Event;
    mockEventRepository.findOne.mockResolvedValue(event);

    const result = await findEventByIdUseCase.execute(1);

    expect(result).toEqual(event);
    expect(mockEventRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('returns null if event not found', async () => {
    mockEventRepository.findOne.mockResolvedValue(null);

    const result = await findEventByIdUseCase.execute(1);

    expect(result).toBeNull();
    expect(mockEventRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
