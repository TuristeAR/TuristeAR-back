import { ItineraryRepository } from '../repositories/itinerary.repository';
import { ProvinceService } from './province.service';
import { PlaceService } from './place.service';
import { Itinerary } from '../entities/itinerary';
import { CreateItineraryDto } from '../../application/dtos/create-itinerary.dto';
import { ActivityService } from './activity.service';
import { Place } from '../entities/place';
import { User } from '../entities/user';
import { CreateActivityDto } from '../../application/dtos/create-activity.dto';
import { UserService } from './user.service';

export class ItineraryService {
  private itineraryRepository: ItineraryRepository;
  private provinceService: ProvinceService;
  private placeService: PlaceService;
  private activityService: ActivityService;
  private userService: UserService;

  constructor() {
    this.itineraryRepository = new ItineraryRepository();
    this.provinceService = new ProvinceService();
    this.placeService = new PlaceService();
    this.activityService = new ActivityService();
    this.userService = new UserService();
  }

  async create(user: User, createItineraryDto: CreateItineraryDto) {
    const dates = this.getDates(createItineraryDto.fromDate, createItineraryDto.toDate);

    const places = await this.placeService.findManyByProvinceId(createItineraryDto.provinceId);

    const provinceName = await this.provinceService.getProvinceNameFromId(
      createItineraryDto.provinceId,
    );

    const itinerary = new Itinerary();

    itinerary.name = `Viaje a ${provinceName}`;
    itinerary.fromDate = createItineraryDto.fromDate;
    itinerary.toDate = createItineraryDto.toDate;
    itinerary.user = user;
    itinerary.activities = [];

    const savedItinerary = await this.itineraryRepository.create(itinerary);

    let itineraryPlaces: Place[] = [];

    for (const date of dates) {
      const place = await this.placeService.findOneByDateWithTypesAndProvinceId(
        places,
        itineraryPlaces,
        date,
        createItineraryDto.types,
        createItineraryDto.provinceId,
      );

      if (place) {
        itineraryPlaces.push(place);

        const activityDates = this.activityService.getActivityDates(place.openingHours, date);

        const createActivityDto: CreateActivityDto = {
          itinerary: savedItinerary,
          place,
          name: this.activityService.formatActivityName(place.name, activityDates[0]),
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

  findAllByUser(user: User): Promise<Itinerary[]> {
    return this.itineraryRepository.findMany({ where: { user } });
  }

  async findActivitiesById(id: number): Promise<Itinerary | null> {
    const itinerary = await this.itineraryRepository.findOne({
      where: { id },
      relations: ['activities', 'activities.place'], // Incluyendo 'place' si necesitas esa información
    });

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

  findOneByIdWithParticipants(id: number): Promise<Itinerary | null> {
    return this.itineraryRepository.findOne({
      where: { id: id },
      relations: ['participants', 'user'],
    });
  }

  async addActivityToItinerary(
    itineraryId: number,
    createActivityDto: CreateActivityDto,
  ): Promise<Itinerary> {
    const itinerary = await this.itineraryRepository.findOne({
      where: { id: itineraryId },
      relations: ['activities'],
    });
    if (!itinerary) {
      throw new Error('Itinerary not found');
    }
    const activity = await this.activityService.create(createActivityDto);
    if (!activity) {
      throw new Error('Failed to create activity');
    }

    // Verifica si ya existen actividades y agrega la nueva sin perder las anteriores
    if (!itinerary.activities) {
      itinerary.activities = [];
    }

    // Añadir la nueva actividad
    itinerary.activities.push(activity);

    // Guardar el itinerario actualizado
    return await this.itineraryRepository.save(itinerary);
  }

  async addUserToItinerary(itineraryId: number, userId: number): Promise<Itinerary> {
    let itinerary = await this.findOneByIdWithParticipants(itineraryId);
    if (!itinerary) {
      throw new Error('Itinerary not found');
    }
    if (itinerary.user.id === userId) {
      throw new Error('Owner cannot be added as a participant');
    }
    let user = await this.userService.findOneById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    if (!itinerary.participants.some((u) => u.id === user.id)) {
      itinerary.participants.push(user);
      return this.itineraryRepository.save(itinerary);
    } else {
      return Promise.resolve(itinerary);
    }
  }

  async removeUserFromItinerary(itineraryId: number, participantId: number): Promise<Itinerary> {
    let itinerary = await this.findOneByIdWithParticipants(itineraryId);
    if (!itinerary) {
      throw new Error('Itinerary not found');
    }
    if (itinerary.user.id === participantId) {
      throw new Error('The owner cannot be removed by a participant');
    }
    let user = await this.userService.findOneById(participantId);
    if (!user) {
      throw new Error('User not found');
    }
    const userIndex = itinerary.participants.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      itinerary.participants.splice(userIndex, 1);
      return this.itineraryRepository.save(itinerary);
    } else {
      throw new Error('User is not part of the itinerary');
    }
  }

  getItineraryWithParticipants(itineraryId: number): Promise<Itinerary | null> {
    return this.itineraryRepository.findOne({
      where: { id: itineraryId },
      relations: ['participants', 'user'],
    });
  }

  async removeActivityFromItinerary(itineraryId: number, activityId: number): Promise<Itinerary> {
    // Buscar el itinerario y sus actividades
    const itinerary = await this.itineraryRepository.findOne({
      where: { id: itineraryId },
      relations: ['activities'],
    });
    if (!itinerary) {
      throw new Error('Itinerary not found');
    }
    // Buscar la actividad dentro del itinerario
    const activityIndex = itinerary.activities.findIndex((activity) => activity.id === activityId);
    // Verificar si la actividad existe en el itinerario
    if (activityIndex === -1) {
      throw new Error('Activity not found in the itinerary');
    }
    // Eliminar la actividad del itinerario
    itinerary.activities.splice(activityIndex, 1);
    // Guardar el itinerario actualizado
    return await this.itineraryRepository.save(itinerary);
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

  getItinerariesWithParticipantsAndUserByUserId(userId: number): Promise<Itinerary[] | null> {
    return this.itineraryRepository.findMany({
      where: [{ participants: { id: userId } }, { user: { id: userId } }],
      relations: ['participants', 'user'],
    });
  }
}
