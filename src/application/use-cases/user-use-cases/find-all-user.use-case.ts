import { User } from '../../../domain/entities/user';
import { UserRepositoryInterface } from '../../../domain/repositories/user.repository.interface';
import { UserRepository } from '../../../infrastructure/repositories/user.repository';

export class FindAllUserUseCase {
  private userRepository: UserRepositoryInterface;

  constructor() {
    this.userRepository = new UserRepository();
  }

  execute(): Promise<User[]> {
    return this.userRepository.findMany({});
  }
}
