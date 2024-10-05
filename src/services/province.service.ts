import { Province } from '../entities/province';
import { ProvinceRepository } from '../repositories/province.repository';
import { CreateProvinceDto } from '../dtos/create-province.dto';
import { get } from '../utils/http.util';

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

    return province?.id;
  }
}
