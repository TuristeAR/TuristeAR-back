import { Culture } from '../entities/culture';
import { CreateCultureDto } from '../../infrastructure/dtos/create-culture.dto';
import { CultureRepository } from '../repositories/culture.repository';

export class CultureService {
  private typeOfCultureRepository: CultureRepository;

  constructor() {
    this.typeOfCultureRepository = new CultureRepository();
  }

  create(createCultureDto: CreateCultureDto): Promise<Culture> {
    return this.typeOfCultureRepository.create(createCultureDto);
  }

  findAll(): Promise<Culture[]> {
    return this.typeOfCultureRepository.findMany({});
  }

  findOneById(id: number): Promise<Culture | null> {
    return this.typeOfCultureRepository.findOne({ where: { id } });
  }
}
