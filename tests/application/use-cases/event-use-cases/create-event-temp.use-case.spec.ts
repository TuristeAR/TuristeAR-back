import { CreateEventTempUseCase } from '../../../../src/application/use-cases/event-use-cases/create-event-temp.use-case';
import { EventTempRepositoryInterface } from '../../../../src/domain/repositories/event_temp.repository.interfaz';
import { EventTemp } from '../../../../src/domain/entities/event_temp';

describe('CreateEventTempUseCase', () => {
  let createEventTempUseCase: CreateEventTempUseCase;
  let mockEventTempRepository: jest.Mocked<EventTempRepositoryInterface>;

  beforeEach(() => {
    mockEventTempRepository = {
      save: jest.fn(),
      findOne: jest.fn(),
      findMany: jest.fn(),
      deleteOne: jest.fn(),
    } as jest.Mocked<EventTempRepositoryInterface>;
    createEventTempUseCase = new CreateEventTempUseCase();
    (createEventTempUseCase as any).eventTempRepository = mockEventTempRepository;
  });

  it('saves a new event temp successfully', async () => {
    const eventTemp: EventTemp = { id: 1, name: 'Test Event' } as EventTemp;
    mockEventTempRepository.save.mockResolvedValue(eventTemp);

    const result = await createEventTempUseCase.execute(eventTemp);

    expect(result).toEqual(eventTemp);
    expect(mockEventTempRepository.save).toHaveBeenCalledWith(eventTemp);
  });

  it('throws an error if event temp is invalid', async () => {
    const invalidEventTemp: EventTemp = { id: 1, name: '' } as EventTemp;
    mockEventTempRepository.save.mockRejectedValue(new Error('Invalid event temp'));

    await expect(createEventTempUseCase.execute(invalidEventTemp)).rejects.toThrow(
      'Invalid event temp',
    );
  });
});
