import { Place } from '../entities/place';
import { PlaceRepository } from '../repositories/place.repository';
import { CreatePlaceDto } from '../../application/dtos/create-place.dto';
import { ProvinceService } from './province.service';
import { post } from '../../utils/http.util';
import { Province } from '../entities/province';
import { In } from 'typeorm';

export class PlaceService {
  private placeRepository: PlaceRepository;
  private provinceService: ProvinceService;

  constructor() {
    this.placeRepository = new PlaceRepository();
    this.provinceService = new ProvinceService();
  }

  create(createPlaceDto: CreatePlaceDto): Promise<Place> {
    return this.placeRepository.create(createPlaceDto);
  }

  findAll(): Promise<Place[]> {
    return this.placeRepository.findMany({});
  }

  findOneByGoogleId(googleId: string): Promise<Place | null> {
    return this.placeRepository.findOne({ where: { googleId } });
  }

  async findOneByDateWithTypesAndProvinceId(
    currentPlaces: Place[],
    date: Date,
    types: string[],
    provinceId: number,
  ): Promise<Place | null> {
    let places: Place[];

    places = await this.placeRepository.findMany({
      where: { province: { id: provinceId } },
      relations: ['province'],
    });

    const filteredPlaces = this.filterPlacesByTypes(places, currentPlaces, types);

    do {
      if (filteredPlaces.length === 0) {
        return null;
      }

      const randomPlace = filteredPlaces[Math.floor(Math.random() * filteredPlaces.length)];

      if (this.isOpenThisDay(randomPlace, date)) {
        return randomPlace;
      }

      filteredPlaces.splice(filteredPlaces.indexOf(randomPlace), 1);
    } while (filteredPlaces.length > 0);

    return null;
  }

  isOpenThisDay(place: Place, date: Date): boolean {
    if (place.openingHours === null) {
      return true;
    }

    const daysOfWeek = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const dayName = daysOfWeek[date.getDay()];
    const openingHoursForToday = place.openingHours.find((hours) => hours.startsWith(dayName));

    return !(!openingHoursForToday || openingHoursForToday.includes('Cerrado'));
  }

  private filterPlacesByTypes(places: Place[], currentPlaces: Place[], types: string[]) {
    const filteredPlaces = places.filter((place) =>
      place.types.some((type) => types.includes(type)),
    );

    return filteredPlaces.filter(
      (place) => !currentPlaces.some((existingPlace) => existingPlace.id === place.id),
    );
  }

  async fetchPlaces(province: string) {
    const places: any[] = [];

    const searchUrl = 'https://places.googleapis.com/v1/places:searchText';

    const searchHeaders = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.GOOGLE_API_KEY as string,
      'X-Goog-FieldMask': 'places,nextPageToken',
    };

    const queries = [
      `actividades en ${province}`,
      `bares en ${province}`,
      `bibliotecas en ${province}`,
      `cafeterías en ${province}`,
      `caminatas en ${province}`,
      `campings en ${province}`,
      `centros comerciales en ${province}`,
      `cervecerías artesanales en ${province}`,
      `cosas para hacer en ${province}`,
      `excursiones en ${province}`,
      `galerías de arte en ${province}`,
      `iglesias en ${province}`,
      `jardines botánicos en ${province}`,
      `lugares para acampar en ${province}`,
      `lugares para pescar en ${province}`,
      `mercados en ${province}`,
      `miradores en ${province}`,
      `monumentos en ${province}`,
      `museos en ${province}`,
      `parques acuáticos en ${province}`,
      `parques en ${province}`,
      `paseos naturales en ${province}`,
      `plazas en ${province}`,
      `playas en ${province}`,
      `restaurantes en ${province}`,
      `ríos en ${province}`,
      `senderismo en ${province}`,
      `sitios arqueológicos en ${province}`,
      `spa en ${province}`,
      `teatros en ${province}`,
      `turismo aventura en ${province}`,
      `viñedos en ${province}`,
      `zoológicos en ${province}`,
    ];

    let hasMoreResults = true;
    let nextPageToken: string | null = null;

    for (const query of queries) {
      const searchBody = {
        textQuery: query,
        languageCode: 'es',
        regionCode: 'AR',
        pageSize: 20,
      };

      while (hasMoreResults && places.length < 100) {
        const results = await post(searchUrl, searchHeaders, {
          ...searchBody,
          pageToken: nextPageToken,
        });

        if (results.places) {
          for (const place of results.places) {
            if (!places.find((p) => p.id === place.id) && !place.types.includes('travel_agency')) {
              places.push(place);
            }
          }
        }

        if (results.nextPageToken) {
          nextPageToken = results.nextPageToken;
        } else {
          hasMoreResults = false;
        }
      }

      nextPageToken = null;
      hasMoreResults = true;
    }

    for (const place of places) {
      const existingPlace = await this.findOneByGoogleId(place.id);

      if (!existingPlace) {
        const provinceId = await this.provinceService.getProvinceIdFromCoordinates(
          place.location.latitude,
          place.location.longitude,
        );

        const createPlaceDto: CreatePlaceDto = {
          provinceId: provinceId as number,
          googleId: place.id,
          name: place.displayName.text,
          types: place.types ?? null,
          address: place.shortFormattedAddress,
          latitude: place.location.latitude,
          longitude: place.location.longitude,
          rating: place.rating || null,
          openingHours: place.currentOpeningHours?.weekdayDescriptions ?? null,
          phoneNumber: place.nationalPhoneNumber ?? null,
        };

        await this.create(createPlaceDto);
      }
    }
  }

  async findManyByPlaceProvinceReviews(identifier: string | number, slice: number): Promise<Province | null> {
    try {
      
        const province = await this.provinceService.findOneWithProvinceReviews(identifier, slice);

        if (!province) {
            throw new Error(`Province ${identifier} not found`);
        }

        return province;
    } catch (error) {
        console.error('Error fetching province with places and reviews:', error);
        throw error;
    }
}
async findPlaceByProvinceAndTypes(provinceId: number, types: string[], count: number): Promise<Place[]> {
  try {
    const places = await this.placeRepository.findMany({
      where: {
        province: { id: provinceId },
      },
      relations: ['province', 'reviews'],
      select: {
        id: true, 
        name: true,
        types: true,
        rating: true,
        address: true,
        reviews: {
          photos: true,
        },
      },
    });

    const filteredPlaces = places.filter((place) =>
      place.types.some((type) => types.includes(type))
    );

    const limitedReviewImages = filteredPlaces.map((place) => {
      const firstReview = place.reviews.length > 0 ? place.reviews[0] : null;
      return {
        ...place,
        reviews: firstReview ? [firstReview] : [], 
      };
    });

    const result = limitedReviewImages.slice(0, count);

    return result;
  } catch (error) {
    console.error('Error fetching places by province and types:', error);
    throw error;
  }
}

}
