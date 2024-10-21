import { ProvinceRepository } from '../../../infrastructure/repositories/province.repository';
import { ProvinceRepositoryInterface } from '../../../domain/repositories/province.repository.interface';
import { Province } from '../../../domain/entities/province';

export class FindProvinceByIdUseCase {
  private provinceRepository: ProvinceRepositoryInterface;

  constructor() {
    this.provinceRepository = new ProvinceRepository();
  }

  execute(id: number): Promise<Province | null> {
    return this.provinceRepository.findOne({ where: { id } });
  }
}
