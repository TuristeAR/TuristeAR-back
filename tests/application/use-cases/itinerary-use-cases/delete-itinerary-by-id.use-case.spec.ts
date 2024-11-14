import { DeleteItineraryByIdUseCase } from '../../../../src/application/use-cases/itinerary-use-cases/delete-itinerary-by-id.use-case';
import { ItineraryRepositoryInterface } from '../../../../src/domain/repositories/itinerary.repository.interface';
import { Itinerary } from '../../../../src/domain/entities/itinerary';
import { DeleteResult } from 'typeorm';

jest.mock('../../../../src/infrastructure/repositories/itinerary.repository');

describe('DeleteItineraryByIdUseCase', () => {
  let deleteItineraryByIdUseCase: DeleteItineraryByIdUseCase;
  let mockItineraryRepository: jest.Mocked<ItineraryRepositoryInterface>; // Mock del repositorio

  beforeEach(() => {
    mockItineraryRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      deleteOne: jest.fn(),
      update: jest.fn(),
    };

    deleteItineraryByIdUseCase = new DeleteItineraryByIdUseCase();
    (deleteItineraryByIdUseCase as any).itineraryRepository = mockItineraryRepository; // Asignamos el mock al caso de uso
  });

  it('should delete an itinerary successfully', async () => {
    const mockItinerary: Itinerary = {
      id: 1,
      activities: [],
      events: [],
      expenses: [],
      name: 'Mi viaje',
      fromDate: new Date(),
      toDate: new Date(),
      user: {} as any,
      participants: [],
      forum: null,
      createdAt: new Date(),
    };

    const deleteResult: DeleteResult = { affected: 1, raw: {} };

    mockItineraryRepository.deleteOne.mockResolvedValue(deleteResult);

    const result = await deleteItineraryByIdUseCase.execute(mockItinerary);

    expect(mockItineraryRepository.deleteOne).toHaveBeenCalledWith(mockItinerary.id);

    expect(result).toEqual(deleteResult);
  });

  it('should throw an error if itinerary cannot be deleted', async () => {
    const mockItinerary: Itinerary = {
      id: 1,
      activities: [],
      events: [],
      expenses: [],
      name: 'My Trip',
      fromDate: new Date(),
      toDate: new Date(),
      user: {} as any,
      participants: [],
      forum: null,
      createdAt: new Date(),
    };

    mockItineraryRepository.deleteOne.mockRejectedValue(new Error('Failed to delete itinerary'));

    await expect(deleteItineraryByIdUseCase.execute(mockItinerary)).rejects.toThrow(
      'Failed to delete itinerary',
    );
  });
});
