import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '../../utils/abstract.entity';

@Entity()
export class User extends AbstractEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  profilePicture: string;

  @Column({ unique: true })
  googleId: string;
}
