import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user';
import { CreateUserDto } from '../dtos/create-user.dto';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.create(createUserDto);
  }
}
