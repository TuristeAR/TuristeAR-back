import { UserRepository } from '../../../infrastructure/repositories/user.repository';
import { UserRepositoryInterface } from '../../../domain/repositories/user.repository.interface';
import { User } from '../../../domain/entities/user';
import { Like } from 'typeorm';

export class FindUserByNameUseCase {
  private userRepository: UserRepositoryInterface;

  constructor() {
    this.userRepository = new UserRepository();
  }

  execute(name: string): Promise<User[]> {
    return this.userRepository.findMany({
      where: {
        name: Like(`%${name}%`),
      },
    });
  }
}
