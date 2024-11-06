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
import { FindPlaceByProvinceLocalityTypeAndPriceLevelUseCase } from '../../application/use-cases/place-use-cases/find-place-by-province-locality-type-priceLevel.use-case';

export class PlaceService {
  private provinceService: ProvinceService;
  private reviewService: ReviewService;

  constructor() {
    this.provinceService = new ProvinceService();
    this.reviewService = new ReviewService();
  }

  async findOneInLocalityByTypesAndPriceLevelWithDate(
    currentPlaces: Place[],
    type: string,
    priceLevel: string[],
    provinceId: number,
    provinceName: string,
    locality: string,
    date: Date,
  ): Promise<Place | null> {
    let place: Place | null = null;

    do {
      const savedPlace = await this.getPlaceInLocalityByTypeAndPriceLevelWithDate(
        provinceId,
        locality,
        type,
        priceLevel,
        currentPlaces,
      );

      if (savedPlace) {
        place = savedPlace;
      } else {
        const fetchedPlace = await this.fetchPlaceInLocalityByTypeAndPriceLevel(
          provinceName,
          locality,
          type,
          priceLevel,
          currentPlaces,
        );

        if (fetchedPlace) {
          place = await this.savePlaceInDatabase(fetchedPlace, provinceId, locality);
        }
      }
    } while (place && !this.isOpenThisDay(place.openingHours, date));

    return place;
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
// ------------------------------------------------ buscar lugares por provincia y tipo 
  async findPlaceByProvinceAndTypes(
    provinceId: number,
    types: string,
    count: number,
    offset: number,
  ): Promise<Place[]> {
    try {
          const findPlaceByProvinceAndTypesUseCase = new FindPlaceByProvinceAndTypesUseCase();
          const findProvinceByIdUseCase = new FindProvinceByIdUseCase();

          let places = await findPlaceByProvinceAndTypesUseCase.execute(provinceId);

          let filteredPlaces: any[] = [];

         // realiza el filtrado de typos
         
            filteredPlaces = places.filter((place) =>
            place.types.some((type) => types === type) // Verifica si coinciden
            );
            // verifica q el filtrado contenga almenos 4 lugares
            if(filteredPlaces.length < 4){
              console.log("place menor a 4 ",filteredPlaces.length);

              const provinceName = await this.provinceService.getProvinceNameFromId(provinceId);

              if (provinceName) {
                do{
                // Realiza el fetch adicional
                const additionalPlace = await this.fetchPlaceByProvinceAndType(provinceName, types);

                const province = await findProvinceByIdUseCase.execute(provinceId);
                  if (province) {  // Verificamos que `province` no sea null
                const newPlace: Place = {
                  province: province,
                  googleId: additionalPlace.id,
                  reviews: additionalPlace.reviews || null,
                  name: additionalPlace.displayName.text,
                  types: additionalPlace.types ?? null,
                  address: additionalPlace.shortFormattedAddress,
                  rating: additionalPlace.rating || null,
                  locality: '',
                  latitude: additionalPlace.latitude,
                  longitude: additionalPlace.longitude,
                  openingHours: additionalPlace.openingHoursForToday,
                  priceLevel: '',
                  phoneNumber: '',
                  activities: additionalPlace.activities,
                  id: additionalPlace.id,
                  createdAt: additionalPlace.createdAt
                }

                filteredPlaces.push(newPlace);
              }
              
            }while(filteredPlaces.length<=4)

              } else {
                 console.error("No se pudo obtener el nombre de la provincia.");
              }
         
          }

          // Mapea los lugares filtrados para limitar las imágenes de reseña
           const limitedReviewImages = filteredPlaces.map((place) => {
           const firstReview = place.reviews.length > 0 ? place.reviews[0] : null;
          return {
            ...place,
            reviews: firstReview ? [firstReview] : [], // Solo toma la primera reseña, si existe
          };
          });
      

          // Limita el resultado a `count` lugares 
          return limitedReviewImages.slice(0, count);

      } catch (error) {
        throw error;
      }
  }
// ------------------------------------------------------------------ fetch api por provincia y tipo
  private async fetchPlaceByProvinceAndType(
    province: string,
    types: string,
  ) {
    let results: any[] = [];
    const searchUrl = 'https://places.googleapis.com/v1/places:searchText';
    const searchHeaders = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.GOOGLE_API_KEY as string,
      'X-Goog-FieldMask': 'places',
    };
    const searchBody = {
      textQuery: types.replace(/_/g, ' ') + ' in ' + province,
      languageCode: 'es',
      regionCode: 'AR',
    };
    const result = await post(searchUrl, searchHeaders, searchBody);
    if (result.places === undefined || result.places === null) {
      results.push(...[]);
    } else {
      results.push(...result.places);
    }

    if ( results.length > 0) {
      do {
        const place = results[Math.floor(Math.random() * results.length)];
        if (place.reviews && place.reviews.length > 0) {
          return place;
        } else {
          results = results.filter((p) => p.id !== place.id);
        }
      } while (results.length > 0);
    }
    return null;
  }

  // ------------------------------------------------------------------------------------------

  orderByDistance(places: Place[], dates: Date[]): Place[] {
    if (places.length <= 1) return places;

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
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
      return R * c;
    };

    const sortedPlaces = places.sort((a, b) => {
      const distanceA = calculateDistance(
        places[0].latitude,
        places[0].longitude,
        a.latitude,
        a.longitude,
      );
      const distanceB = calculateDistance(
        places[0].latitude,
        places[0].longitude,
        b.latitude,
        b.longitude,
      );
      return distanceA - distanceB;
    });

    for (let i = 0; i < sortedPlaces.length; i++) {
      if (!this.isOpenThisDay(sortedPlaces[i].openingHours, dates[i])) {
        for (let j = i + 1; j < sortedPlaces.length; j++) {
          if (this.isOpenThisDay(sortedPlaces[j].openingHours, dates[i])) {
            [sortedPlaces[i], sortedPlaces[j]] = [sortedPlaces[j], sortedPlaces[i]];
            break;
          }
        }
      }
    }

    return sortedPlaces;
  }

  isOpenThisDay(openingHours: string[], date: Date): boolean {
    if (openingHours === null || !date) {
      return true;
    }

    const daysOfWeek = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const dayName = daysOfWeek[date.getDay()];
    const openingHoursForToday = openingHours.find((hours) => hours.startsWith(dayName));

    return !(!openingHoursForToday || openingHoursForToday.includes('Cerrado'));
  }

  private async getPlaceInLocalityByTypeAndPriceLevelWithDate(
    provinceId: number,
    locality: string,
    type: string,
    priceLevel: string[],
    currentPlaces: Place[],
  ) {
    const findPlaceByProvinceLocalityTypeAndPriceLevelUseCase =
      new FindPlaceByProvinceLocalityTypeAndPriceLevelUseCase();

    const results = await findPlaceByProvinceLocalityTypeAndPriceLevelUseCase.execute(
      provinceId,
      locality,
      type,
      priceLevel,
    );

    const places = this.filterPlacesByCurrentPlaces(results, currentPlaces);

    if (places.length > 0) {
      return places[Math.floor(Math.random() * places.length)];
    }

    return null;
  }

 

  private async fetchPlaceInLocalityByTypeAndPriceLevel(
    province: string,
    locality: string,
    type: string,
    priceLevel: string[],
    currentPlaces: Place[],
  ) {
    let results: any[] = [];

    const searchUrl = 'https://places.googleapis.com/v1/places:searchText';

    const searchHeaders = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.GOOGLE_API_KEY as string,
      'X-Goog-FieldMask': 'places',
    };

    const searchBody = {
      textQuery: type.replace(/_/g, ' ') + ' in ' + locality + ', ' + province,
      languageCode: 'es',
      regionCode: 'AR',
    };

    const result = await post(searchUrl, searchHeaders, searchBody);

    if (result.places === undefined || result.places === null) {
      results.push(...[]);
    } else {
      results.push(...result.places);
    }

    let places: any[];

    places = this.filterPlacesByCurrentPlaces(results, currentPlaces);

    places = this.filterPlacesByPriceLevel(places, priceLevel);

    if (places.length > 0) {
      do {
        const place = places[Math.floor(Math.random() * places.length)];

        if (place.reviews && place.reviews.length > 0) {
          return place;
        } else {
          places = places.filter((p) => p.id !== place.id);
        }
      } while (places.length > 0);
    }

    return null;
  }

  private filterPlacesByCurrentPlaces(places: any[], currentPlaces: Place[]) {
    return places.filter(
      (place) => !currentPlaces.some((existingPlace) => existingPlace.googleId === place.id),
    );
  }

  private filterPlacesByPriceLevel(places: any[], priceLevel: string[]) {
    return places.filter(
      (place) =>
        priceLevel.includes(place.priceLevel) ||
        place.priceLevel === 'PRICE_LEVEL_UNSPECIFIED' ||
        place.priceLevel === undefined,
    );
  }

  private async savePlaceInDatabase(place: any, provinceId: number, locality: string) {
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
        locality: locality,
        latitude: place.location.latitude,
        longitude: place.location.longitude,
        rating: place.rating || null,
        priceLevel: place.priceLevel || null,
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
