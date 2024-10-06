import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user';
import { CreateUserDto } from '../../application/dtos/create-user.dto';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.create(createUserDto);
  }

  findOneByGoogleId(googleId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { googleId } });
  }
}