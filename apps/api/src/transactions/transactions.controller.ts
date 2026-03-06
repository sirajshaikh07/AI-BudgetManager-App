import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    ParseUUIDPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, UpdateTransactionDto, FilterTransactionsDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @Post()
    async create(
        @CurrentUser('userId') userId: string,
        @Body() dto: CreateTransactionDto,
    ): Promise<unknown> {
        return this.transactionsService.create(userId, dto);
    }

    @Get()
    async findAll(
        @CurrentUser('userId') userId: string,
        @Query() filters: FilterTransactionsDto,
    ): Promise<unknown> {
        return this.transactionsService.findAll(userId, filters);
    }

    @Get(':id')
    async findOne(
        @CurrentUser('userId') userId: string,
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<unknown> {
        return this.transactionsService.findOne(userId, id);
    }

    @Patch(':id')
    async update(
        @CurrentUser('userId') userId: string,
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateTransactionDto,
    ): Promise<unknown> {
        return this.transactionsService.update(userId, id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(
        @CurrentUser('userId') userId: string,
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<{ message: string }> {
        await this.transactionsService.remove(userId, id);
        return { message: 'Transaction deleted successfully' };
    }
}
