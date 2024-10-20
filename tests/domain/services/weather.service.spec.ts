import { CreateWeatherDto } from '../../../src/infrastructure/dtos/create-weather.dto';
import { WeatherRepository } from '../../../src/infrastructure/repositories/weather.repository';
import { WeatherService } from '../../../src/domain/services/weather.service';
import { Weather } from '../../../src/domain/entities/weather';

jest.mock('../../../src/infrastructure/repositories/weather.repository');

describe('WeatherService', () => {
  let weatherService: WeatherService;
  let weatherRepository: jest.Mocked<WeatherRepository>;

  beforeEach(() => {
    weatherRepository = new WeatherRepository() as jest.Mocked<WeatherRepository>;
    weatherService = new WeatherService();
    (weatherService as any).weatherRepository = weatherRepository;
  });

  it('creates a new weather', async () => {
    const createWeatherDto: CreateWeatherDto = {
      name: 'Test Weather',
    };

    await weatherService.create(createWeatherDto);

    expect(weatherRepository.create).toHaveBeenCalledWith(createWeatherDto);
  });

  it('finds all weathers', async () => {
    const weathers = [{ id: 1, name: 'Test Weather' }] as Weather[];

    weatherRepository.findMany.mockResolvedValue(weathers);

    const result = await weatherService.findAll();

    expect(result).toEqual(weathers);
    expect(weatherRepository.findMany).toHaveBeenCalledWith({});
  });

  it('finds a weather by id', async () => {
    const weather = { id: 1, name: 'Test Weather' } as Weather;

    weatherRepository.findOne.mockResolvedValue(weather);

    const result = await weatherService.findOneById(1);

    expect(result).toEqual(weather);
    expect(weatherRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('returns null if weather not found by id', async () => {
    weatherRepository.findOne.mockResolvedValue(null);

    const result = await weatherService.findOneById(999);

    expect(result).toBeNull();
    expect(weatherRepository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
  });
});
