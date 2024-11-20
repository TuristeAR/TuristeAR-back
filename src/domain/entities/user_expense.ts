import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user';
import { Expense } from './expense';
import { AbstractEntity } from './abstract.entity';

@Entity()
export class UserExpense extends AbstractEntity {

  @Column({ type: 'decimal', scale: 2 })
  amount: number;

  @Column({ default: false })
  isPaid: boolean;

  @ManyToOne(() => User, { nullable: false })
  user: User;
  
  @ManyToOne(() => Expense, (expense) => expense.userExpenses)
  @JoinColumn({ name: 'expenseId' })
  expense: Expense;
}
