import {
    IsString,
    IsNotEmpty,
    IsEnum,
    IsOptional,
    MaxLength,
    IsBoolean,
    Matches,
} from 'class-validator';
import { CategoryType } from '../entities/category.entity';

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name!: string;

    @IsEnum(CategoryType)
    type!: CategoryType;

    @IsOptional()
    @IsString()
    parentId?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    icon?: string;

    @IsOptional()
    @IsString()
    @Matches(/^#[0-9A-Fa-f]{6}$/, { message: 'Color must be a valid hex color' })
    color?: string;

    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;
}
