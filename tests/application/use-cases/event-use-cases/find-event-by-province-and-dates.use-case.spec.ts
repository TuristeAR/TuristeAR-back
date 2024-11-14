import { EventRepositoryInterface } from '../../../../src/domain/repositories/event.repository.interface';
import { Event } from '../../../../src/domain/entities/event';
import { Weather } from '../../../../src/domain/entities/weather';
import { Itinerary } from '../../../../src/domain/entities/itinerary';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { FindEventByProvinceAndDatesUseCase } from '../../../../src/application/use-cases/event-use-cases/find-event-by-province-and-dates.use-case';

describe('FindEventByProvinceAndDatesUseCase', () => {
  let useCase: FindEventByProvinceAndDatesUseCase;
  let eventRepository: jest.Mocked<EventRepositoryInterface>;

  beforeEach(() => {
    eventRepository = {
      findMany: jest.fn(),
    } as unknown as jest.Mocked<EventRepositoryInterface>;
    useCase = new FindEventByProvinceAndDatesUseCase();
    (useCase as any).eventRepository = eventRepository;
  });

  it('returns events for a valid province id and date range', async () => {
    const events: Event[] = [
      {
        id: 1,
        name: 'Event 1',
        fromDate: new Date(),
        toDate: new Date(),
        locality: 'Locality 1',
        description: 'Event description',
        image: 'image.jpg',
        latitude: 0,
        longitude: 0,
        itinerary: new Itinerary(),
        createdAt: new Date(),
        province: {
          id: 1,
          name: 'Province 1',
          georefId: '',
          description: '',
          images: [],
          places: [],
          weather: new Weather(),
          category: null,
          createdAt: new Date(),
        },
      },
    ];

    eventRepository.findMany.mockResolvedValue(events);

    const result = await useCase.execute(1, new Date('2023-01-01'), new Date('2023-12-31'));

    expect(result).toEqual(events);
    expect(eventRepository.findMany).toHaveBeenCalledWith({
      where: {
        province: { id: 1 },
        fromDate: MoreThanOrEqual(new Date('2023-01-01')),
        toDate: LessThanOrEqual(new Date('2023-12-31')),
      },
      relations: ['province'],
    });
  });

  it('returns an empty array if no events are found for the province id and date range', async () => {
    eventRepository.findMany.mockResolvedValue([]);

    const result = await useCase.execute(1, new Date('2023-01-01'), new Date('2023-12-31'));

    expect(result).toEqual([]);
    expect(eventRepository.findMany).toHaveBeenCalledWith({
      where: {
        province: { id: 1 },
        fromDate: MoreThanOrEqual(new Date('2023-01-01')),
        toDate: LessThanOrEqual(new Date('2023-12-31')),
      },
      relations: ['province'],
    });
  });

  it('throws an error if the repository throws an error', async () => {
    eventRepository.findMany.mockRejectedValue(new Error('Repository error'));

    await expect(
      useCase.execute(1, new Date('2023-01-01'), new Date('2023-12-31')),
    ).rejects.toThrow('Repository error');
  });
});
