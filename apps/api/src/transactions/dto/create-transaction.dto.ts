import {
    IsString,
    IsNotEmpty,
    IsEnum,
    IsOptional,
    IsNumber,
    IsPositive,
    IsDateString,
    IsUUID,
    IsArray,
    MaxLength,
} from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';

export class CreateTransactionDto {
    @IsUUID()
    @IsNotEmpty()
    accountId!: string;

    @IsOptional()
    @IsUUID()
    toAccountId?: string;

    @IsUUID()
    @IsNotEmpty()
    categoryId!: string;

    @IsEnum(TransactionType)
    type!: TransactionType;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive({ message: 'Amount must be greater than 0' })
    amount!: number;

    @IsOptional()
    @IsString()
    @MaxLength(3)
    currency?: string;

    @IsDateString()
    transactionDate!: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    merchant?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
}
