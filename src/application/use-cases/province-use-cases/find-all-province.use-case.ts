import { ProvinceRepository } from '../../../infrastructure/repositories/province.repository';
import { ProvinceRepositoryInterface } from '../../../domain/repositories/province.repository.interface';
import { Province } from '../../../domain/entities/province';

export class FindAllProvinceUseCase {
  private provinceRepository: ProvinceRepositoryInterface;

  constructor() {
    this.provinceRepository = new ProvinceRepository();
  }

  execute(): Promise<Province[]> {
    return this.provinceRepository.findMany({});
  }
}
