import { User } from '../../../domain/entities/user';
import { UserRepositoryInterface } from '../../../domain/repositories/user.repository.interface';
import { UserRepository } from '../../../infrastructure/repositories/user.repository';

export class FindUserByGoogleIdUseCase {
  private userRepository: UserRepositoryInterface;

  constructor() {
    this.userRepository = new UserRepository();
  }

  execute(googleId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { googleId } });
  }
}
