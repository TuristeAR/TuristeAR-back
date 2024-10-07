import { ItineraryRepository } from '../repositories/itinerary.repository';
import { PlaceService } from './place.service';
import { Itinerary } from '../entities/itinerary';
import { CreateItineraryDto } from '../../application/dtos/create-itinerary.dto';
import { ActivityService } from './activity.service';
import { Place } from '../entities/place';
import { User } from '../entities/user';
import { CreateActivityDto } from '../../application/dtos/create-activity.dto';

export class ItineraryService {
  private itineraryRepository: ItineraryRepository;
  private placeService: PlaceService;
  private activityService: ActivityService;

  constructor() {
    this.itineraryRepository = new ItineraryRepository();
    this.placeService = new PlaceService();
    this.activityService = new ActivityService();
  }

  async create(user: User, createItineraryDto: CreateItineraryDto) {
    const dates = this.getDates(createItineraryDto.fromDate, createItineraryDto.toDate);

    const places: Place[] = [];

    const itinerary = new Itinerary();

    itinerary.fromDate = createItineraryDto.fromDate;
    itinerary.toDate = createItineraryDto.toDate;
    itinerary.user = user;
    itinerary.activities = [];

    const savedItinerary = await this.itineraryRepository.create(itinerary);

    for (const date of dates) {
      const place = await this.placeService.findOneByDateWithTypesAndProvinceId(
        places,
        date,
        createItineraryDto.types,
        createItineraryDto.provinceId,
      );

      if (place) {
        places.push(place);

        const activityDates = this.activityService.getActivityDates(place.openingHours, date);

        const createActivityDto: CreateActivityDto = {
          itinerary: savedItinerary,
          place,
          fromDate: activityDates[0],
          toDate: activityDates[1],
        };

        const activity = await this.activityService.create(createActivityDto);

        savedItinerary.activities.push(activity);
      }
    }

    return savedItinerary;
  }

  findAll(): Promise<Itinerary[]> {
    return this.itineraryRepository.findMany({});
  }

  findOneById(id: number): Promise<Itinerary | null> {
    return this.itineraryRepository.findOne({ where: { id } });
  }

  private getDates(fromDate: Date, toDate: Date): Date[] {
    const dates = [];
    const currentDate = new Date(fromDate);
    const endDate = new Date(toDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }
}
