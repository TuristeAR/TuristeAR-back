import { Place } from '../entities/place';
import { CreatePlaceDto } from '../../infrastructure/dtos/create-place.dto';
import { post } from '../utils/http.util';
import { Province } from '../entities/province';
import { FindPlaceByGoogleIdUseCase } from '../../application/use-cases/place-use-cases/find-place-by-googleId.use-case';
import { ProvinceService } from './province.service';
import { FindProvinceByIdUseCase } from '../../application/use-cases/province-use-cases/find-province-by-id.use-case';
import { CreatePlaceUseCase } from '../../application/use-cases/place-use-cases/create-place.use-case';
import { FindPlaceByProvinceAndTypesUseCase } from '../../application/use-cases/place-use-cases/find-place-by-province-and-types.use-case';
import { FindPlaceByProvinceNameUseCase } from '../../application/use-cases/place-use-cases/find-place-by-province-name.use-case';
import { ReviewService } from './review.service';

export class PlaceService {
  private provinceService: ProvinceService;
  private reviewService: ReviewService;

  constructor() {
    this.provinceService = new ProvinceService();
    this.reviewService = new ReviewService();
  }

  async findOneInLocalityByDateWithTypes(
    currentPlaces: Place[],
    date: Date,
    type: string,
    provinceId: number,
    provinceName: string,
    locality: string,
  ): Promise<Place> {
    do {
      const place = await this.fetchPlaceInLocalityWithType(
        provinceName,
        locality,
        type,
        currentPlaces,
      );

      if (
        !place.regularOpeningHours ||
        this.isOpenThisDay(place.regularOpeningHours.weekdayDescriptions, date)
      ) {
        return await this.savePlaceInDatabase(place, provinceId);
      }
    } while (true);
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
      const findPlaceByGoogleIdUseCase = new FindPlaceByGoogleIdUseCase();

      const existingPlace = await findPlaceByGoogleIdUseCase.execute(place.id);

      if (!existingPlace) {
        const provinceId = await this.provinceService.getProvinceIdFromCoordinates(
          place.location.latitude,
          place.location.longitude,
        );

        const findProvinceByIdUseCase = new FindProvinceByIdUseCase();

        const province = await findProvinceByIdUseCase.execute(provinceId as number);

        const createPlaceDto: CreatePlaceDto = {
          province: province as Province,
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

        const createPlaceUseCase = new CreatePlaceUseCase();

        await createPlaceUseCase.execute(createPlaceDto);
      }
    }
  }

  async findManyByPlaceProvinceReviews(
    identifier: string | number,
    slice: number,
  ): Promise<Province | null> {
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

  async findPlaceByProvinceAndTypes(
    provinceId: number,
    types: string[],
    count: number,
    offset: number,
  ): Promise<Place[]> {
    try {
      const findPlaceByProvinceAndTypesUseCase = new FindPlaceByProvinceAndTypesUseCase();

      const places = await findPlaceByProvinceAndTypesUseCase.execute(provinceId);

      const joinedTypes = types.join(',');

      if (types) {
        const filteredPlaces = places.filter((place) =>
          place.types.some((type) => joinedTypes.includes(type)),
        );
        const limitedReviewImages = filteredPlaces.map((place) => {
          const firstReview = place.reviews.length > 0 ? place.reviews[0] : null;
          return {
            ...place,
            reviews: firstReview ? [firstReview] : [],
          };
        });
      }
      const limitedReviewImages = places.map((place) => {
        const firstReview = place.reviews.length > 0 ? place.reviews[0] : null;
        return {
          ...place,
          reviews: firstReview ? [firstReview] : [],
        };
      });

      return limitedReviewImages.slice(0, count);
    } catch (error) {
      throw error;
    }
  }

  private calculatorDistance(
    lat1: number | null,
    lon1: number | null,
    lat2: number | null,
    lon2: number | null,
  ) {
    console.log('lat1', lat1);
    console.log('lon1', lon1);
    console.log('lat2', lat2);
    console.log('lon2', lon2);

    if (lat1 && lon1 && lat2 && lon2) {
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return R * c < 20;
    }
    return null;
  }

  private isOpenThisDay(openingHours: string[], date: Date): boolean {
    if (openingHours === null) {
      return true;
    }

    const daysOfWeek = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const dayName = daysOfWeek[date.getDay()];
    const openingHoursForToday = openingHours.find((hours) => hours.startsWith(dayName));

    return !(!openingHoursForToday || openingHoursForToday.includes('Cerrado'));
  }

  private filterPlacesByTypes(places: any[], currentPlaces: Place[], types: string[]) {
    const joinedTypes = types.join(',');

    const filteredPlaces = places.filter((place) =>
      place.types.some((type: string) => joinedTypes.includes(type)),
    );

    return filteredPlaces.filter(
      (place) => !currentPlaces.some((existingPlace) => existingPlace.id === place.id),
    );
  }

  private async fetchPlaceInLocalityWithType(
    province: string,
    locality: string,
    type: string,
    currentPlaces: Place[],
  ) {
    const types = type.split(',');

    let results: any[] = [];

    const searchUrl = 'https://places.googleapis.com/v1/places:searchText';

    const searchHeaders = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.GOOGLE_API_KEY as string,
      'X-Goog-FieldMask': 'places',
    };

    for (const type of types) {
      const searchBody = {
        textQuery: type + ' in ' + locality + ', ' + province,
        includedType: type,
        strictTypeFiltering: true,
        languageCode: 'es',
        regionCode: 'AR',
      };

      const result = await post(searchUrl, searchHeaders, searchBody);

      results.push(...result.places);
    }

    const places = this.filterPlacesByCurrentPlaces(results, currentPlaces);

    return places[Math.floor(Math.random() * places.length)];
  }

  private filterPlacesByCurrentPlaces(places: any[], currentPlaces: Place[]) {
    return places.filter(
      (place) => !currentPlaces.some((existingPlace) => existingPlace.googleId === place.id),
    );
  }

  private async savePlaceInDatabase(place: any, provinceId: number) {
    const findPlaceByGoogleIdUseCase = new FindPlaceByGoogleIdUseCase();

    const existingPlace = await findPlaceByGoogleIdUseCase.execute(place.id);

    if (!existingPlace) {
      const findProvinceByIdUseCase = new FindProvinceByIdUseCase();

      const province = await findProvinceByIdUseCase.execute(provinceId);

      const createPlaceDto: CreatePlaceDto = {
        province: province as Province,
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

      const createPlaceUseCase = new CreatePlaceUseCase();

      const createdPlace = await createPlaceUseCase.execute(createPlaceDto);

      await this.reviewService.fetchReviews(createdPlace.googleId);

      return createdPlace;
    }

    return existingPlace;
  }

  findManyByPlaceProvinceId(provinceId: number) {
    const findPlaceByProvinceNameUseCase = new FindPlaceByProvinceNameUseCase();

    return findPlaceByProvinceNameUseCase.execute(provinceId);
  }
}
