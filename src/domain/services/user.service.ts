import { PublicationRepository } from '../repositories/user.repository';
import { User } from '../entities/user';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { Like } from 'typeorm';

export class UserService {
  private userRepository: PublicationRepository;

  constructor() {
    this.userRepository = new PublicationRepository();
  }

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.create(createUserDto);
  }

  findOneById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  findOneByGoogleId(googleId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { googleId } });
  }
  
  searchByName(name: string, offset: number): Promise<User[]> {
    return this.userRepository.findMany({
      where: {
        name: Like(`%${name}%`),
      },
      take: 10,
      skip: offset,
    });
  }

  findAll(): Promise<User[]>{
    return this.userRepository.findAll();
  }
}
