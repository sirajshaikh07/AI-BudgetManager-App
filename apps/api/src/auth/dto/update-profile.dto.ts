import { IsString, IsOptional, MaxLength, Length } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    fullName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    phone?: string;

    @IsOptional()
    @IsString()
    @Length(3, 3)
    currency?: string;

    @IsOptional()
    @IsString()
    @Length(2, 2)
    country?: string;

    @IsOptional()
    @IsString()
    avatarUrl?: string;
}
