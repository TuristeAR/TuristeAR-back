import { ProvinceRepositoryInterface } from '../../../domain/repositories/province.repository.interface';
import { CreateProvinceDto } from '../../../infrastructure/dtos/create-province.dto';
import { Province } from '../../../domain/entities/province';
import { ProvinceRepository } from '../../../infrastructure/repositories/province.repository';

export class CreateProvinceUseCase {
  private provinceRepository: ProvinceRepositoryInterface;

  constructor() {
    this.provinceRepository = new ProvinceRepository();
  }

  execute(createProvinceDto: CreateProvinceDto): Promise<Province> {
    return this.provinceRepository.create(createProvinceDto);
  }
}
