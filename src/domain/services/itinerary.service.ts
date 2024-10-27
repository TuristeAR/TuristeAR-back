import { ProvinceService } from './province.service';
import { PlaceService } from './place.service';
import { Itinerary } from '../entities/itinerary';
import { CreateItineraryDto } from '../../infrastructure/dtos/create-itinerary.dto';
import { ActivityService } from './activity.service';
import { Place } from '../entities/place';
import { User } from '../entities/user';
import { CreateActivityDto } from '../../infrastructure/dtos/create-activity.dto';
import { CreateActivityUseCase } from '../../application/use-cases/activity-use-cases/create-activity.use-case';
import { FindUserByIdUseCase } from '../../application/use-cases/user-use-cases/find-user-by.id.use-case';
import { CreateItineraryUseCase } from '../../application/use-cases/itinerary-use-cases/create-itinerary.use-case';
import { FindPlaceByProvinceUseCase } from '../../application/use-cases/place-use-cases/find-place-by-province.use-case';
import { FindItineraryWithActivityUseCase } from '../../application/use-cases/itinerary-use-cases/find-itinerary-with-activity.use-case';
import { UpdateItineraryUseCase } from '../../application/use-cases/itinerary-use-cases/update-itinerary.use-case';
import { FindItineraryWithParticipantsUseCase } from '../../application/use-cases/itinerary-use-cases/find-itinerary-with-participants.use-case';
import { Forum } from '../entities/forum';
import { CreateForumUseCase } from '../../application/use-cases/forum-use-cases/create-forum.use-case';

export class ItineraryService {
  private provinceService: ProvinceService;
  private placeService: PlaceService;
  private activityService: ActivityService;
  private createActivityUseCase: CreateActivityUseCase;
  private findUserByIdUseCase: FindUserByIdUseCase;

  constructor() {
    this.provinceService = new ProvinceService();
    this.placeService = new PlaceService();
    this.activityService = new ActivityService();
    this.createActivityUseCase = new CreateActivityUseCase();
    this.findUserByIdUseCase = new FindUserByIdUseCase();
  }

  async create(user: User, createItineraryDto: CreateItineraryDto) {
    const dates = this.getDates(createItineraryDto.fromDate, createItineraryDto.toDate);

    const findPlaceByProvinceUseCase = new FindPlaceByProvinceUseCase();

    const places = await findPlaceByProvinceUseCase.execute(createItineraryDto.provinceId);

    const provinceName = await this.provinceService.getProvinceNameFromId(
      createItineraryDto.provinceId,
    );

    const itinerary = new Itinerary();

    itinerary.name = `Viaje a ${provinceName}`;
    itinerary.fromDate = createItineraryDto.fromDate;
    itinerary.toDate = createItineraryDto.toDate;
    itinerary.user = user;
    itinerary.activities = [];

    const createItineraryUseCase = new CreateItineraryUseCase();

    const savedItinerary = await createItineraryUseCase.execute(itinerary);

    let forum = new Forum();
    forum.itinerary = savedItinerary;
    forum.name = savedItinerary.name;
    forum.messages = [];
    forum.isPublic = false;

    const createForumUseCase = new CreateForumUseCase();

    itinerary.forum = await createForumUseCase.execute(forum);

    const updateItinerary=new UpdateItineraryUseCase();

    await updateItinerary.execute(savedItinerary);

    let itineraryPlaces: Place[] = [];

    let longitude = null;
    let latitude = null;

    for (const date of dates) {
      const place = await this.placeService.findOneByDateWithTypesAndProvinceId(
        places,
        itineraryPlaces,
        date,
        createItineraryDto.types,
        createItineraryDto.provinceId,
        longitude,
        latitude,
      );

      if (place) {
        itineraryPlaces.push(place);
        if (longitude == null) {
          longitude = place.longitude;
          latitude = place.latitude;
        }

        const activityDates = this.activityService.getActivityDates(place.openingHours, date);

        const createActivityDto: CreateActivityDto = {
          itinerary: savedItinerary,
          place,
          name: this.activityService.formatActivityName(place.name, activityDates[0]),
          fromDate: activityDates[0],
          toDate: activityDates[1],
        };

        const activity = await this.createActivityUseCase.execute(createActivityDto);

        savedItinerary.activities.push(activity);
      }
    }

    return savedItinerary;
  }

  async findActivitiesByItineraryId(id: number): Promise<Itinerary | null> {
    const findItineraryWithActivityUseCase = new FindItineraryWithActivityUseCase();

    const itinerary = await findItineraryWithActivityUseCase.execute(id);

    if (!itinerary) return null;

    return {
      ...itinerary,
      activities: itinerary.activities.map((activity) => ({
        id: activity.id,
        createdAt: activity.createdAt,
        name: activity.name,
        fromDate: activity.fromDate,
        toDate: activity.toDate,
        itinerary: activity.itinerary,
        place: activity.place,
      })),
    };
  }

  async addActivityToItinerary(
    itineraryId: number,
    createActivityDto: CreateActivityDto,
  ): Promise<Itinerary> {
    const findItineraryWithActivityUseCase = new FindItineraryWithActivityUseCase();

    const itinerary = await findItineraryWithActivityUseCase.execute(itineraryId);

    if (!itinerary) {
      throw new Error('Itinerary not found');
    }

    const activity = await this.createActivityUseCase.execute(createActivityDto);

    if (!activity) {
      throw new Error('Failed to create activity');
    }

    if (!itinerary.activities) {
      itinerary.activities = [];
    }

    itinerary.activities.push(activity);

    const updateItineraryUseCase = new UpdateItineraryUseCase();

    return updateItineraryUseCase.execute(itinerary);
  }

  async addUserToItinerary(itineraryId: number, userId: number): Promise<Itinerary> {
    const findItineraryWithParticipantsUseCase = new FindItineraryWithParticipantsUseCase();

    const itinerary = await findItineraryWithParticipantsUseCase.execute(itineraryId);

    if (!itinerary) {
      throw new Error('Itinerary not found');
    }

    if (itinerary.user.id === userId) {
      throw new Error('Owner cannot be added as a participant');
    }

    const user = await this.findUserByIdUseCase.execute(userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (!itinerary.participants.some((u) => u.id === user.id)) {
      itinerary.participants.push(user);

      const updateItineraryUseCase = new UpdateItineraryUseCase();

      return updateItineraryUseCase.execute(itinerary);
    } else {
      return Promise.resolve(itinerary);
    }
  }

  async removeUserFromItinerary(itineraryId: number, participantId: number): Promise<Itinerary> {
    const findItineraryWithParticipantsUseCase = new FindItineraryWithParticipantsUseCase();

    const itinerary = await findItineraryWithParticipantsUseCase.execute(itineraryId);

    if (!itinerary) {
      throw new Error('Itinerary not found');
    }

    if (itinerary.user.id === participantId) {
      throw new Error('The owner cannot be removed by a participant');
    }

    const user = await this.findUserByIdUseCase.execute(participantId);

    if (!user) {
      throw new Error('User not found');
    }

    const userIndex = itinerary.participants.findIndex((u) => u.id === user.id);

    if (userIndex !== -1) {
      itinerary.participants.splice(userIndex, 1);

      const updateItineraryUseCase = new UpdateItineraryUseCase();

      return updateItineraryUseCase.execute(itinerary);
    } else {
      throw new Error('User is not part of the itinerary');
    }
  }

  async removeActivityFromItinerary(itineraryId: number, activityId: number): Promise<Itinerary> {
    const findItineraryWithActivityUseCase = new FindItineraryWithActivityUseCase();

    const itinerary = await findItineraryWithActivityUseCase.execute(itineraryId);

    if (!itinerary) {
      throw new Error('Itinerary not found');
    }

    const activityIndex = itinerary.activities.findIndex((activity) => activity.id === activityId);

    if (activityIndex === -1) {
      throw new Error('Activity not found in the itinerary');
    }

    itinerary.activities.splice(activityIndex, 1);

    const updateItineraryUseCase = new UpdateItineraryUseCase();

    return updateItineraryUseCase.execute(itinerary);
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
