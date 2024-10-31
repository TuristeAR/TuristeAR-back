import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Itinerary } from './itinerary';
import { User } from './user';

@Entity()
export class Expense extends AbstractEntity {
  @Column()
  description: string;

  @Column()
  date: Date;

  @Column()
  totalAmount: number;

  @Column()
  distributionType: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'payerId' })
  payer: User;

  @ManyToOne(() => Itinerary)
  @JoinColumn({ name: 'itineraryId' })
  itinerary: Itinerary;

  @Column('json')
  individualAmounts: Record<string, number>;

  @Column('json')
  individualPercentages: Record<string, number>;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'expense_participants',
    joinColumn: { name: 'expenseId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  participatingUsers: User[];
}
