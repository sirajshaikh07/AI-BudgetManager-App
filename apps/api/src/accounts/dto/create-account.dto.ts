import {
    IsString,
    IsNotEmpty,
    IsEnum,
    IsOptional,
    IsNumber,
    MaxLength,
    Length,
    Matches,
} from 'class-validator';
import { AccountType } from '../entities/account.entity';

export class CreateAccountDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name!: string;

    @IsEnum(AccountType)
    type!: AccountType;

    @IsOptional()
    @IsString()
    @MaxLength(3)
    currency?: string;

    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 })
    initialBalance?: number;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    bankName?: string;

    @IsOptional()
    @IsString()
    @Length(4, 4)
    accountNumberLast4?: string;

    @IsOptional()
    @IsString()
    @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Color must be a valid hex color (e.g., #4F46E5)' })
    color?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    icon?: string;
}
