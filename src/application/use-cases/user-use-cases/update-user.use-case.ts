import { User } from '../../../domain/entities/user';
import { UserRepository } from '../../../infrastructure/repositories/user.repository';
import { UserRepositoryInterface } from '../../../domain/repositories/user.repository.interface';

export class UpdateUserUseCase {
  private userRepository: UserRepositoryInterface;

  constructor() {
    this.userRepository = new UserRepository();
  }

  execute(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
