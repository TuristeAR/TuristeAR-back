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
import { CreateNotificationUseCase } from '../../application/use-cases/notification-use-cases/create-notification.use-case';
import { Notification } from '../entities/notification';

export class ItineraryService {
  private provinceService: ProvinceService;
  private placeService: PlaceService;
  private activityService: ActivityService;
  private createActivityUseCase: CreateActivityUseCase;
  private findUserByIdUseCase: FindUserByIdUseCase;
  private findEventByIdUseCase: FindEventByIdUseCase;

  constructor() {
    this.provinceService = new ProvinceService();
    this.placeService = new PlaceService();
    this.activityService = new ActivityService();
    this.createActivityUseCase = new CreateActivityUseCase();
    this.findUserByIdUseCase = new FindUserByIdUseCase();
    this.findEventByIdUseCase = new FindEventByIdUseCase();
  }

  async create(user: User, createItineraryDto: CreateItineraryDto) {
    const totalDays = this.getDates(createItineraryDto.fromDate, createItineraryDto.toDate).length;

    const daysPerProvince = Math.floor(totalDays / createItineraryDto.provinces.length);

    const itinerary = new Itinerary();

    itinerary.name = '';
    itinerary.fromDate = createItineraryDto.fromDate;
    itinerary.toDate = createItineraryDto.toDate;
    itinerary.user = user;
    itinerary.activities = [];
    itinerary.events = [];

    const forum = new Forum();

    forum.name = '';
    forum.messages = [];
    forum.isPublic = false;

    const createForumUseCase = new CreateForumUseCase();

    itinerary.forum = await createForumUseCase.execute(forum);

    let localities: {
      province: string;
      locality: string;
      days: number;
      fromDate: Date;
      toDate: Date;
    }[] = [];

    for (const eventId of createItineraryDto.events) {
      const event = await this.findEventByIdUseCase.execute(eventId);

      if (!event) {
        throw new Error('Event not found');
      }

      itinerary.events.push(event);
    }

    const createItineraryUseCase = new CreateItineraryUseCase();

    const savedItinerary = await createItineraryUseCase.execute(itinerary);

    let itineraryPlaces: Place[] = [];

    let usedPlaces: Place[] = [];

    let currentDate = new Date(createItineraryDto.fromDate);

    for (const locality of createItineraryDto.localities) {
      const localitiesInProvince = createItineraryDto.localities.filter(
        (loc) => loc.province.id === locality.province.id,
      );

      const baseDaysPerLocality = Math.floor(daysPerProvince / localitiesInProvince.length);

      const extraDays = daysPerProvince % localitiesInProvince.length;

      const isExtraDay = localitiesInProvince.indexOf(locality) < extraDays;

      const daysPerLocality = baseDaysPerLocality + (isExtraDay ? 1 : 0);

      const localityStartDate = new Date(currentDate);

      const localityEndDate = new Date(currentDate);

      localityEndDate.setDate(localityEndDate.getDate() + daysPerLocality - 1);

      localities.push({
        province: locality.province.id,
        locality: locality.name,
        days: daysPerLocality,
        fromDate: new Date(localityStartDate),
        toDate: new Date(localityEndDate),
      });

      currentDate.setDate(currentDate.getDate() + daysPerLocality);
    }

    const groupedLocalities = createItineraryDto.provinces.map((province) => ({
      provinceId: province.georefId,
      localities: localities.filter((locality) => locality.province === province.georefId),
    }));

    groupedLocalities.forEach((group) => {
      group.localities.sort((a, b) => a.fromDate.getTime() - b.fromDate.getTime());
    });

    const orderedLocalities = groupedLocalities.flatMap((group) => group.localities);

    orderedLocalities.forEach((locality) => {
      locality.fromDate = new Date(currentDate);
      locality.toDate = new Date(currentDate);
      locality.toDate.setDate(locality.toDate.getDate() + locality.days - 1);

      currentDate.setDate(currentDate.getDate() + locality.days);
    });

    console.log('LOCALIDADES ORDENADAS: ', orderedLocalities);

    for (const province of createItineraryDto.provinces) {
      const provinceStartDate = new Date(currentDate);

      const provinceEndDate = new Date(currentDate);

      provinceEndDate.setDate(provinceEndDate.getDate() + daysPerProvince - 1);

      const hasEventForProvince = itinerary.events.some((event) => {
        const eventStartDate = new Date(event.fromDate);

        const eventEndDate = new Date(event.toDate);

        return eventStartDate >= provinceStartDate && eventEndDate <= provinceEndDate;
      });

      if (hasEventForProvince) {
        const eventForProvince = itinerary.events.find((event) => {
          const eventStartDate = new Date(event.fromDate);

          const eventEndDate = new Date(event.toDate);

          return eventStartDate >= provinceStartDate && eventEndDate <= provinceEndDate;
        });

        if (eventForProvince) {
          const eventStartDate = new Date(eventForProvince.fromDate);

          const eventEndDate = new Date(eventForProvince.toDate);

          if (eventStartDate < provinceStartDate) {
            provinceStartDate.setDate(eventStartDate.getDate());
          }

          if (eventEndDate > provinceEndDate) {
            provinceEndDate.setDate(eventEndDate.getDate());
          }

          currentDate = new Date(provinceEndDate);

          currentDate.setDate(currentDate.getDate() + 1);
        }
      }

      for (let i = 0; i < daysPerProvince; i++) {
        const eventForDay = itinerary.events.find((event) =>
          this.isInDate(event.fromDate, event.toDate, currentDate),
        );

        let activitiesForDay = [];

        const localityForDay = localities.find(
          (locality) => locality.fromDate.getTime() === currentDate.getTime(),
        )?.locality;

        console.log('LOCALITY FOR DAY: ', localityForDay);

        if (eventForDay) {
          const previousPlaceType =
            usedPlaces.length > 0 ? usedPlaces[usedPlaces.length - 1].types : null;

          const randomType =
            createItineraryDto.types[Math.floor(Math.random() * createItineraryDto.types.length)];

          const placeType = previousPlaceType ? previousPlaceType : randomType.split(',');

          const place = await this.findNextPlace(
            itineraryPlaces,
            usedPlaces[usedPlaces.length - 1] || { types: placeType },
            createItineraryDto,
            province.id,
            province.name,
            localityForDay as string,
            this.filterTypesByCompany(createItineraryDto.types, createItineraryDto.company),
            usedPlaces,
            currentDate,
          );

          if (!place || usedPlaces.some((usedPlace) => usedPlace.id === place.id)) continue;

          usedPlaces.push(place);

          usedPlaces = this.placeService.orderByDistance(
            usedPlaces,
            this.getDates(currentDate, currentDate),
          );

          const activityDates = this.activityService.getActivityDates(
            place.openingHours,
            currentDate,
          );
          const createActivityDto: CreateActivityDto = {
            itinerary: savedItinerary,
            place,
            name: this.activityService.formatActivityName(place.name, activityDates[0]),
            fromDate: activityDates[0],
            toDate: activityDates[1],
            images: [],
          };

          const activity = await this.createActivityUseCase.execute(createActivityDto);

          activitiesForDay.push(activity);
        } else {
          for (let j = 0; j < 2; j++) {
            const previousPlaceType =
              usedPlaces.length > 0 ? usedPlaces[usedPlaces.length - 1].types : null;

            const randomType =
              createItineraryDto.types[Math.floor(Math.random() * createItineraryDto.types.length)];

            const placeType = previousPlaceType ? previousPlaceType : randomType.split(',');

            const place = await this.findNextPlace(
              itineraryPlaces,
              usedPlaces[usedPlaces.length - 1] || { types: placeType },
              createItineraryDto,
              province.id,
              province.name,
              localityForDay as string,
              this.filterTypesByCompany(createItineraryDto.types, createItineraryDto.company),
              usedPlaces,
              currentDate,
            );

            if (!place || usedPlaces.some((usedPlace) => usedPlace.id === place.id)) continue;

            usedPlaces.push(place);

            usedPlaces = this.placeService.orderByDistance(
              usedPlaces,
              this.getDates(currentDate, currentDate),
            );

            const [startDate, endDate] =
              j === 0
                ? this.activityService.getActivityDates(place.openingHours, currentDate)
                : this.getNextActivityDates(place, activitiesForDay[0].toDate);

            const createActivityDto: CreateActivityDto = {
              itinerary: savedItinerary,
              place,
              name: this.activityService.formatActivityName(place.name, startDate),
              fromDate: startDate,
              toDate: endDate,
              images: [],
            };

            const activity = await this.createActivityUseCase.execute(createActivityDto);

            activitiesForDay.push(activity);
          }
        }

        savedItinerary.activities.push(...activitiesForDay);

        currentDate.setDate(currentDate.getDate() + 1);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return savedItinerary;
  }

  async addEventToItinerary(itineraryId: number, eventId: number): Promise<Itinerary> {
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
    if (Object.keys(event).length > 0) {
      itinerary.events.push(event);
    } else {
      console.warn('Trying to add an empty event to the itinerary');
    }

    const updateItineraryUseCase = new UpdateItineraryUseCase();

    return updateItineraryUseCase.execute(itinerary);
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

      const createNotificationUseCase = new CreateNotificationUseCase();
      const notification = new Notification();
      notification.itinerary = itinerary;
      notification.user = user;
      notification.description = itinerary.user.name + ' te agregó a su viaje!';
      notification.publication = null;
      notification.isRead = false;

      await createNotificationUseCase.execute(notification);

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

  private async findNextPlace(
    itineraryPlaces: Place[],
    currentPlace: Place,
    createItineraryDto: CreateItineraryDto,
    provinceId: number,
    provinceName: string,
    locality: string,
    typesByCompany: string[],
    usedPlaces: Place[],
    date: Date,
  ): Promise<Place | null> {
    let place: Place | null = null;

    const usedTypes = currentPlace.types;

    const availableTypes = typesByCompany.filter((type) => !usedTypes.includes(type));

    for (const types of availableTypes) {
      const typesArray = types.split(',');

      place = await this.placeService.findOneInLocalityByTypesAndPriceLevelWithDate(
        itineraryPlaces,
        typesArray,
        createItineraryDto.priceLevel,
        provinceId,
        provinceName,
        locality,
        date,
      );

      if (place && !usedPlaces.some((usedPlace) => usedPlace.id === place?.id)) {
        return place;
      }
    }

    return place;
  }

  private isInDate(eventFromDate: Date, eventToDate: Date, date: Date): boolean {
    return date >= eventFromDate && date <= eventToDate;
  }

  private getNextActivityDates(place: Place, endDate: Date) {
    const nextStartDate = endDate;

    nextStartDate.setHours(nextStartDate.getHours() + 4);

    return this.activityService.getActivityDates(place.openingHours, nextStartDate, true);
  }
}
