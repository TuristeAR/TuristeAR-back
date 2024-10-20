import { CreateUserDto } from '../../../infrastructure/dtos/create-user.dto';
import { User } from '../../../domain/entities/user';
import { UserRepository } from '../../../infrastructure/repositories/user.repository';
import { UserRepositoryInterface } from '../../../domain/repositories/user.repository.interface';

export class CreateUserUseCase {
  private userRepository: UserRepositoryInterface;

  constructor() {
    this.userRepository = new UserRepository();
  }

  execute(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.create(createUserDto);
  }
}
