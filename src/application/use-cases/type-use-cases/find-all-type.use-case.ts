import { TypeRepositoryInterface } from '../../../domain/repositories/type.repository.interface';
import { TypeRepository } from '../../../infrastructure/repositories/type.repository';
import { Type } from '../../../domain/entities/type';

export class FindAllTypeUseCase {
  private typeRepository: TypeRepositoryInterface;

  constructor() {
    this.typeRepository = new TypeRepository();
  }

  execute(): Promise<Type[]> {
    return this.typeRepository.findMany({});
  }
}
