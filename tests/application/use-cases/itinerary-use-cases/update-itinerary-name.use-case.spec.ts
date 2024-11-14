import { UpdateItineraryNameUseCase } from '../../../../src/application/use-cases/itinerary-use-cases/update-itinerary-name.use-case';
import { ItineraryRepositoryInterface } from '../../../../src/domain/repositories/itinerary.repository.interface';

describe('UpdateItineraryNameUseCase', () => {
  let updateItineraryNameUseCase: UpdateItineraryNameUseCase;
  let itineraryRepositoryMock: jest.Mocked<ItineraryRepositoryInterface>;

  beforeEach(() => {
    itineraryRepositoryMock = {
      create: jest.fn(),
      findOne: jest.fn(),
      findMany: jest.fn(),
      save: jest.fn(),
      deleteOne: jest.fn(),
      update: jest.fn(),
    } as jest.Mocked<ItineraryRepositoryInterface>;
    updateItineraryNameUseCase = new UpdateItineraryNameUseCase();
    (updateItineraryNameUseCase as any).itineraryRepository = itineraryRepositoryMock;
  });

  it('should update itinerary name successfully', async () => {
    const itineraryId = 1;
    const name = 'New Itinerary Name';
    itineraryRepositoryMock.update.mockResolvedValue(true as any);

    const result = await updateItineraryNameUseCase.execute(itineraryId, name);

    expect(itineraryRepositoryMock.update).toHaveBeenCalledWith(itineraryId, { name });
    expect(result).toBe(true);
  });

  it('should throw an error if repository update fails', async () => {
    const itineraryId = 1;
    const name = 'New Itinerary Name';
    itineraryRepositoryMock.update.mockRejectedValue(new Error('Update failed'));

    await expect(updateItineraryNameUseCase.execute(itineraryId, name)).rejects.toThrow(
      'Update failed',
    );
  });
});
