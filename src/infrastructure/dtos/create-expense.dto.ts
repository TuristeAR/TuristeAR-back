import { IsArray, IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum DistributionType {
  SPLIT = 'split',
  EQUALLY = 'equally',
}

export class CreateExpenseDto {
  @IsString()
  description: string;

  @IsDate()
  date: Date;

  @IsNumber()
  payerId: number;

  @IsNumber()
  totalAmount: number;

  @IsEnum(DistributionType)
  distributionType: DistributionType;

  @IsArray()
  @IsString({ each: true })
  participatingUsers?: string[];

  @IsNumber()
  itineraryId: number;

  @IsArray()
  @IsNumber({}, { each: true }) 
  individualAmounts?: number[];
}
