import { User } from '../../domain/entities/user';

export class CreatePublicationDTO {
  description: string;
  images: string[];
  creationDate: string;
  user: User;
}