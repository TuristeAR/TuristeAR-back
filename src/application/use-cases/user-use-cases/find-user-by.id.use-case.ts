import { User } from '../../../domain/entities/user';
import { UserRepositoryInterface } from '../../../domain/repositories/user.repository.interface';
import { UserRepository } from '../../../infrastructure/repositories/user.repository';

export class FindUserByIdUseCase {
  private userRepository: UserRepositoryInterface;

  constructor() {
    this.userRepository = new UserRepository();
  }

  execute(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}
