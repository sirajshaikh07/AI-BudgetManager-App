import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
    private readonly logger = new Logger(CategoriesService.name);

    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    /**
     * List all categories visible to a user:
     * - Global defaults (user_id IS NULL, is_default = true)
     * - User's custom categories
     */
    async findAll(userId: string): Promise<Category[]> {
        return this.categoryRepository.find({
            where: [
                { userId: IsNull(), isDefault: true },
                { userId },
            ],
            order: { isDefault: 'DESC', name: 'ASC' },
        });
    }

    /**
     * Create a custom category for a user.
     */
    async create(userId: string, dto: CreateCategoryDto): Promise<Category> {
        const category = this.categoryRepository.create({
            userId,
            name: dto.name,
            type: dto.type,
            parentId: dto.parentId ?? null,
            icon: dto.icon ?? 'tag',
            color: dto.color ?? '#6B7280',
            isDefault: false, // user-created categories are never defaults
        });

        const saved = await this.categoryRepository.save(category);
        this.logger.log(`Category created: ${saved.id} for user: ${userId}`);
        return saved;
    }

    /**
     * Get all default/global categories (for seed check or initial load).
     */
    async findDefaults(): Promise<Category[]> {
        return this.categoryRepository.find({
            where: { isDefault: true, userId: IsNull() },
            order: { name: 'ASC' },
        });
    }
}
