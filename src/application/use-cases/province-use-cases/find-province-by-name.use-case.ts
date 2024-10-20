import { Province } from '../../../domain/entities/province';
import { ProvinceRepositoryInterface } from '../../../domain/repositories/province.repository.interface';
import { ProvinceRepository } from '../../../infrastructure/repositories/province.repository';

export class FindProvinceByNameUseCase {
  private provinceRepository: ProvinceRepositoryInterface;

  constructor() {
    this.provinceRepository = new ProvinceRepository();
  }

  execute(name: string): Promise<Province | null> {
    return this.provinceRepository.findOne({ where: { name: name } });
  }
}
