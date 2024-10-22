import { Place } from '../entities/place';
import { CreatePlaceDto } from '../../infrastructure/dtos/create-place.dto';
import { post } from '../utils/http.util';
import { Province } from '../entities/province';
import { FindPlaceByGoogleIdUseCase } from '../../application/use-cases/place-use-cases/find-place-by-googleId.use-case';
import { ProvinceService } from './province.service';
import { FindProvinceByIdUseCase } from '../../application/use-cases/province-use-cases/find-province-by-id.use-case';
import { CreatePlaceUseCase } from '../../application/use-cases/place-use-cases/create-place.use-case';
import { FindPlaceByProvinceAndTypesUseCase } from '../../application/use-cases/place-use-cases/find-place-by-province-and-types.use-case';

export class PlaceService {
  private provinceService: ProvinceService;

  constructor() {
    this.provinceService = new ProvinceService();
  }

  private calculatorDistance(lat1: number | null, lon1: number | null, lat2: number | null, lon2: number | null)  {
    if(lat1 && lon1 && lat2 && lon2){
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

  async findOneByDateWithTypesAndProvinceId(
    places: Place[],
    currentPlaces: Place[],
    date: Date,
    types: string[],
    provinceId: number,
    longitude: number | null,
    latitude: number | null,
  ): Promise<Place | null> {

    const filteredPlaces = this.filterPlacesByTypes(places, currentPlaces, types);

    do {
      if (filteredPlaces.length === 0) {
        const place = await this.fetchPlaceByTypesAndProvinceId(currentPlaces, types, provinceId);
        filteredPlaces.push(place);
      }

      const randomPlace = filteredPlaces[Math.floor(Math.random() * filteredPlaces.length)];

      let distance = (latitude) ? this.calculatorDistance(latitude, longitude, randomPlace.latitude, randomPlace.longitude) : true;

      if (this.isOpenThisDay(randomPlace, date) && distance) {
        return randomPlace;
      }


      filteredPlaces.splice(filteredPlaces.indexOf(randomPlace), 1);
    } while (filteredPlaces.length > 0);

    return null;
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
  ): Promise<Place[]> {
    try {
      const findPlaceByProvinceAndTypesUseCase = new FindPlaceByProvinceAndTypesUseCase();

      const places = await findPlaceByProvinceAndTypesUseCase.execute(provinceId);

      const joinedTypes = types.join(',');

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

      return limitedReviewImages.slice(0, count);
    } catch (error) {
      throw error;
    }
  }

  private isOpenThisDay(place: Place, date: Date): boolean {
    if (place.openingHours === null) {
      return true;
    }

    const daysOfWeek = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const dayName = daysOfWeek[date.getDay()];
    const openingHoursForToday = place.openingHours.find((hours) => hours.startsWith(dayName));

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

  private async fetchPlaceByTypesAndProvinceId(
    currentPlaces: Place[],
    types: string[],
    provinceId: number,
  ) {
    let results: any[] = [];

    const provinceName = await this.provinceService.getProvinceNameFromId(provinceId);

    const searchHeaders = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.GOOGLE_API_KEY as string,
      'X-Goog-FieldMask': 'places',
    };

    const splitTypes = types[0].split(',');

    for (const type of splitTypes) {
      try {
        const searchUrl = 'https://places.googleapis.com/v1/places:searchText';

        const searchBody = {
          textQuery: type + ' in ' + provinceName + ' Province',
          includedType: type,
          strictTypeFiltering: true,
          languageCode: 'es',
          regionCode: 'AR',
        };

        const result = await post(searchUrl, searchHeaders, searchBody);

        results.push(...result.places);
      } catch (error) {
        results.push(...[]);
      }
    }

    const places = this.filterPlacesByTypes(results, currentPlaces, types);

    const randomPlace = places[Math.floor(Math.random() * places.length)];

    return this.savePlaceInDatabase(randomPlace, provinceId);
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

      return createPlaceUseCase.execute(createPlaceDto);
    }

    return existingPlace;
  }
}
