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
import { FindItineraryWithActivityUseCase } from '../../application/use-cases/itinerary-use-cases/find-itinerary-with-activity.use-case';
import { UpdateItineraryUseCase } from '../../application/use-cases/itinerary-use-cases/update-itinerary.use-case';
import { FindItineraryWithParticipantsUseCase } from '../../application/use-cases/itinerary-use-cases/find-itinerary-with-participants.use-case';
import { UpdateDateActivityIdUseCase } from '../../application/use-cases/activity-use-cases/update-date-activity-id.use-case';
import { Forum } from '../entities/forum';
import { CreateForumUseCase } from '../../application/use-cases/forum-use-cases/create-forum.use-case';
import { FindEventByIdUseCase } from '../../application/use-cases/event-use-cases/find-event-by-id.use-case';
import { FindItineraryWithEventUseCase } from '../../application/use-cases/itinerary-use-cases/find-itinerary-with-event.use-case';

export class ItineraryService {
  private provinceService: ProvinceService;
  private placeService: PlaceService;
  private activityService: ActivityService;
  private createActivityUseCase: CreateActivityUseCase;
  private findUserByIdUseCase: FindUserByIdUseCase;
  private updateDateActivityUseCase: UpdateDateActivityIdUseCase;
  private findEventByIdUseCase: FindEventByIdUseCase;

  constructor() {
    this.provinceService = new ProvinceService();
    this.placeService = new PlaceService();
    this.activityService = new ActivityService();
    this.createActivityUseCase = new CreateActivityUseCase();
    this.findUserByIdUseCase = new FindUserByIdUseCase();
    this.updateDateActivityUseCase = new UpdateDateActivityIdUseCase();
    this.findEventByIdUseCase = new FindEventByIdUseCase();
  }

  async create(user: User, createItineraryDto: CreateItineraryDto) {
    const dates = this.getDates(createItineraryDto.fromDate, createItineraryDto.toDate);

    const typesByCompany = this.filterTypesByCompany(
      createItineraryDto.types,
      createItineraryDto.company,
    );

    const provinceName = await this.provinceService.getProvinceNameFromId(
      createItineraryDto.provinceId,
    );

    const itinerary = new Itinerary();

    itinerary.name = `Viaje a ${provinceName}`;
    itinerary.fromDate = createItineraryDto.fromDate;
    itinerary.toDate = createItineraryDto.toDate;
    itinerary.user = user;
    itinerary.activities = [];
    itinerary.events = [];

    for (const eventId of createItineraryDto.events) {
      const event = await this.findEventByIdUseCase.execute(eventId);

      if (!event) {
        throw new Error('Event not found');
      }

      itinerary.events.push(event);
    }

    const createItineraryUseCase = new CreateItineraryUseCase();

    const savedItinerary = await createItineraryUseCase.execute(itinerary);

    let forum = new Forum();
    forum.itinerary = savedItinerary;
    forum.name = savedItinerary.name;
    forum.messages = [];
    forum.isPublic = false;

    const createForumUseCase = new CreateForumUseCase();

    itinerary.forum = await createForumUseCase.execute(forum);

    const updateItinerary = new UpdateItineraryUseCase();

    await updateItinerary.execute(savedItinerary);

    let itineraryPlaces: Place[] = [];

    for (let i = 0; i < dates.length; i++) {
      const locality = createItineraryDto.localities[i % createItineraryDto.localities.length];

      const types = typesByCompany[i % createItineraryDto.types.length].split(',');

      const type = types[i % types.length];

      const place = await this.placeService.findOneInLocalityByTypesAndPriceLevel(
        itineraryPlaces,
        type,
        createItineraryDto.priceLevel,
        createItineraryDto.provinceId,
        provinceName as string,
        locality,
      );

      itineraryPlaces.push(place);
    }

    itineraryPlaces = this.placeService.orderByDistance(itineraryPlaces, dates);

    for (let i = 0; i < dates.length; i++) {
      const activityDates = this.activityService.getActivityDates(
        itineraryPlaces[i].openingHours,
        dates[i],
      );

      const createActivityDto: CreateActivityDto = {
        itinerary: savedItinerary,
        place: itineraryPlaces[i],
        name: this.activityService.formatActivityName(itineraryPlaces[i].name, activityDates[0]),
        fromDate: activityDates[0],
        toDate: activityDates[1],
        images: [],
      };

      const activity = await this.createActivityUseCase.execute(createActivityDto);

      savedItinerary.activities.push(activity);
    }

    return savedItinerary;
  }

  async addEventToItinerary(itineraryId: number, eventId: number): Promise<Event | null> {
    const findItineraryWithEventUseCase = new FindItineraryWithEventUseCase();
    const itinerary = await findItineraryWithEventUseCase.execute(itineraryId);

    if (!itinerary) {
      throw new Error('Itinerary not found');
    }

    const event = await this.findEventByIdUseCase.execute(eventId);

    if (!event) {
      throw new Error('Event not found');
    }

    if (!itinerary.events) {
      itinerary.events = [];
    }

    const eventExists = itinerary.events.some(existingEvent => existingEvent.id === event.id);
    if (!eventExists) {
      itinerary.events.push(event);
      const updateItineraryUseCase = new UpdateItineraryUseCase();
      await updateItineraryUseCase.execute(itinerary); 
      return event as unknown as Event;
    } else {
      console.warn('Event already added to the itinerary');
      return null;
    }
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
        images: activity.images,
      })),
    };
  }

  async findEventsByItineraryId(id: number): Promise<Itinerary | null> {
    const findItineraryWithEventsUseCase = new FindItineraryWithEventUseCase();

    const itinerary = await findItineraryWithEventsUseCase.execute(id);

    if (!itinerary) return null;

    return {
      ...itinerary,
      events: itinerary.events.map((event) => ({
        id: event.id,
        createdAt: event.createdAt,
        fromDate: event.fromDate,
        toDate: event.toDate,
        name: event.name,
        province: event.province,
        locality: event.locality,
        description: event.description,
        latitude: event.latitude,
        longitude: event.longitude,
        image: event.image,
        itinerary: event.itinerary,
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

  async removeEventFromItinerary(itineraryId: number, eventId: number): Promise<Itinerary> {
    const findItineraryWithEventUseCase = new FindItineraryWithEventUseCase();

    const itinerary = await findItineraryWithEventUseCase.execute(itineraryId);

    if (!itinerary) {
      throw new Error('Itinerary not found');
    }

    const eventIndex = itinerary.events.findIndex((event) => event.id === eventId);

    if (eventIndex === -1) {
      throw new Error('Event not found in the itinerary');
    }

    itinerary.events.splice(eventIndex, 1);

    const updateItineraryUseCase = new UpdateItineraryUseCase();

    return updateItineraryUseCase.execute(itinerary);
  }

  async updateDateActivityDates(activityId: Number, start: Date, end: Date) {
    const updateDateActivityUseCase = new UpdateDateActivityIdUseCase();

    try {
      await updateDateActivityUseCase.update(activityId as number, {
        fromDate: new Date(start),
        toDate: new Date(end),
      });
    } catch (error) {
      console.error('Error updating activity:', error);
      throw new Error('Could not update activity');
    }
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

  private filterTypesByCompany(types: string[], company: number): string[] {
    if (company < 1 || company > 4) {
      throw new Error('Invalid company');
    }

    const typesByCompany: Record<number, string[]> = {
      1: [
        'bar',
        'tourist_attraction',
        'landmark',
        'scenic_viewpoint',
        'natural_feature',
        'historical_landmark',
        'cafe',
        'coffee_shop',
        'library',
        'museum',
        'political',
        'art_gallery',
        'theater',
        'city_hall',
        'park',
        'botanical_garden',
        'national_park',
        'campground',
        'hiking_area',
        'scenic_point',
        'ski_resort',
        'sports_complex',
        'surf_spot',
        'mountain',
        'wilderness_area',
        'climbing_area',
        'nature_reserve',
        'wildlife_reserve',
      ],
      2: [
        'bar',
        'restaurant',
        'cafe',
        'coffee_shop',
        'food_court',
        'bakery',
        'tourist_attraction',
        'landmark',
        'scenic_viewpoint',
        'natural_feature',
        'movie_theater',
        'concert_hall',
        'museum',
        'art_gallery',
        'theater',
        'city_hall',
        'church',
        'place_of_worship',
        'sports_complex',
        'ice_skating_rink',
        'mountain',
        'national_forest',
        'wilderness_area',
        'beach',
        'lake',
        'forest',
        'nature_reserve',
        'waterfall',
        'wildlife_reserve',
      ],
      3: [
        'bar',
        'night_club',
        'music_venue',
        'dance_club',
        'cocktail_bar',
        'event_venue',
        'beer_hall',
        'food',
        'pub',
        'karaoke',
        'stadium',
        'sports_complex',
        'skate_park',
        'escape_room',
        'amusement_park',
        'bowling_alley',
        'pool_hall',
        'casino',
        'park',
        'beach',
        'lake',
        'mountain',
        'trailhead',
        'national_forest',
        'wilderness_area',
        'climbing_area',
        'nature_reserve',
        'wildlife_reserve',
      ],
      4: [
        'park',
        'zoo',
        'aquarium',
        'amusement_park',
        'museum',
        'political',
        'restaurant',
        'food_court',
        'water_park',
        'movie_theater',
        'botanical_garden',
        'national_park',
        'library',
        'cultural_center',
        'theater',
        'church',
        'place_of_worship',
        'embassy',
        'stadium',
        'sports_complex',
        'karaoke',
        'nature_reserve',
        'wildlife_reserve',
        'beach',
        'lake',
        'forest',
        'waterfall',
        'mountain',
        'campground',
        'trailhead',
        'national_forest',
        'wilderness_area',
        'climbing_area',
      ],
    };

    const allowedTypes = typesByCompany[company];

    return types.map((typeString) => {
      const filteredTypes = typeString
        .split(',')
        .filter((type) => allowedTypes.includes(type))
        .join(',');

      return filteredTypes || typeString;
    });
  }
}
