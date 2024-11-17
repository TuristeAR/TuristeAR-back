import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Itinerary } from './itinerary';
import { User } from './user';
import { UserExpense } from './user_expense';
import { DistributionType } from '../enum/distribution-type.enum';

@Entity()
export class Expense extends AbstractEntity {
  @Column()
  description: string;

  @Column()
  date: Date;

  @Column()
  totalAmount: number;

  @Column({
    type: 'enum',
    enum: DistributionType,
  })
  distributionType: DistributionType;

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

  @Column('simple-json',{ nullable: true })
  imageUrls: string[] | null; 
  
  @OneToMany(() => UserExpense, (userExpense) => userExpense.expense)
  userExpenses: UserExpense[];
}
