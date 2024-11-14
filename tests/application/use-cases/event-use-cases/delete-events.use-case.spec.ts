import { DeleteEventsUseCase } from '../../../../src/application/use-cases/event-use-cases/delete-events.use-case';
import { EventRepositoryInterface } from '../../../../src/domain/repositories/event.repository.interface';
import { Event } from '../../../../src/domain/entities/event';
import { DeleteResult } from 'typeorm';

describe('DeleteEventsUseCase', () => {
  let deleteEventsUseCase: DeleteEventsUseCase;
  let mockEventRepository: jest.Mocked<EventRepositoryInterface>;

  beforeEach(() => {
    mockEventRepository = {
      findOne: jest.fn(),
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    } as jest.Mocked<EventRepositoryInterface>;
    deleteEventsUseCase = new DeleteEventsUseCase();
    (deleteEventsUseCase as any).eventRepository = mockEventRepository;
  });

  it('deletes events successfully', async () => {
    const events: Event[] = [{ id: 1, name: 'Test Event' } as Event];
    const deleteResult: DeleteResult = { affected: 1, raw: [] };
    mockEventRepository.deleteMany.mockResolvedValue(deleteResult);

    const result = await deleteEventsUseCase.execute(events);

    expect(result).toEqual(deleteResult);
    expect(mockEventRepository.deleteMany).toHaveBeenCalledWith([1]);
  });

  it('throws an error if events array is empty', async () => {
    const events: Event[] = [];
    mockEventRepository.deleteMany.mockRejectedValue(new Error('No events to delete'));

    await expect(deleteEventsUseCase.execute(events)).rejects.toThrow('No events to delete');
  });
});
