import { Province } from '../entities/province';
import { get } from '../utils/http.util';
import { FindProvinceByIdUseCase } from '../../application/use-cases/province-use-cases/find-province-by-id.use-case';
import { FindProvinceByNameUseCase } from '../../application/use-cases/province-use-cases/find-province-by-name.use-case';
import { FindProvinceWithReviewsUseCase } from '../../application/use-cases/province-use-cases/find-province-with-reviews.use-case';

export class ProvinceService {
  async getProvinceNameFromId(id: number): Promise<string | null> {
    const findProvinceByIdUseCase = new FindProvinceByIdUseCase();

    const province = await findProvinceByIdUseCase.execute(id);

    return province?.name || null;
  }

  async getProvinceIdFromCoordinates(latitude: number, longitude: number) {
    const headers = {
      'Content-Type': 'application/json',
    };

    const response = await get(
      `${process.env.GEOREF_URL}/georef/api/ubicacion?lat=${latitude}&lon=${longitude}`,
      headers,
    );

    const provinceName = response.ubicacion.provincia.nombre;

    const findProvinceByNameUseCase = new FindProvinceByNameUseCase();

    const province = await findProvinceByNameUseCase.execute(provinceName);

    return province?.id || null;
  }

  async findOneWithProvinceReviews(
    identifier: string | number,
    slice: number,
  ): Promise<Province | null> {
    const idNumber = typeof identifier === 'number' ? identifier : Number(identifier);

    const isId = !isNaN(idNumber);

    const findProvinceWithReviewsUseCase = new FindProvinceWithReviewsUseCase();

    const province = await findProvinceWithReviewsUseCase.execute(isId, idNumber, identifier);

    if (!province) {
      return null;
    }

    province.places = province.places
      .map((place) => {
        if (place.reviews) {
          place.reviews = place.reviews.filter((review) => review.rating >= 4);
        }
        return place;
      })
      .filter((place) => place.reviews.length > 0)
      .slice(0, slice);

    return province;
  }
}
