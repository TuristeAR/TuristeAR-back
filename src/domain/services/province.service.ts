import { Province } from '../entities/province';
import { ProvinceRepository } from '../repositories/province.repository';
import { CreateProvinceDto } from '../../application/dtos/create-province.dto';
import { get } from '../../utils/http.util';

export class ProvinceService {
  private provinceRepository: ProvinceRepository;

  constructor() {
    this.provinceRepository = new ProvinceRepository();
  }

  create(createProvinceDto: CreateProvinceDto): Promise<Province> {
    return this.provinceRepository.create(createProvinceDto);
  }

  findAll(): Promise<Province[]> {
    return this.provinceRepository.findMany({});
  }

  findByName(name: string): Promise<Province | null> {
    return this.provinceRepository.findOne({ where: { name: name } });
  }

  findOneById(id: number): Promise<Province | null> {
    return this.provinceRepository.findOne({ where: { id } });
  }

  async getProvinceNameFromId(id: number): Promise<string | null> {
    const province = await this.provinceRepository.findOne({ where: { id } });

    if (!province) {
      throw new Error('Province not found');
    }

    return province.name;
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

    const province = await this.provinceRepository.findOne({ where: { name: provinceName } });

    return province?.id || null;
  }

  async findOneWithProvinceReviews(
    identifier: string | number,
    slice: number,
  ): Promise<Province | null> {
    const idNumber = typeof identifier === 'number' ? identifier : Number(identifier);
    const isId = !isNaN(idNumber);

    const province = await this.provinceRepository.findOne({
      where: isId ? { id: idNumber } : { name: String(identifier) },

      relations: ['places', 'places.reviews'],
      select: {
        id: true,
        name: true,
        description: true,
        images: true,
        places: {
          id: true,
          name: true,
          reviews: {
            authorName: true,
            authorPhoto: true,
            publishedTime: true,
            photos: true,
            rating: true,
            text: true,
          },
        },
      },
    });

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
