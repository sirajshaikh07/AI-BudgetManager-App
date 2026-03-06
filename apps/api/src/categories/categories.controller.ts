import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    async findAll(@CurrentUser('userId') userId: string): Promise<unknown> {
        return this.categoriesService.findAll(userId);
    }

    @Post()
    async create(
        @CurrentUser('userId') userId: string,
        @Body() dto: CreateCategoryDto,
    ): Promise<unknown> {
        return this.categoriesService.create(userId, dto);
    }
}
