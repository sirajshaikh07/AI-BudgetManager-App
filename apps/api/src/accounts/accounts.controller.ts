import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    ParseUUIDPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto, UpdateAccountDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
    constructor(private readonly accountsService: AccountsService) { }

    @Post()
    async create(
        @CurrentUser('userId') userId: string,
        @Body() dto: CreateAccountDto,
    ): Promise<unknown> {
        return this.accountsService.create(userId, dto);
    }

    @Get()
    async findAll(@CurrentUser('userId') userId: string): Promise<unknown> {
        return this.accountsService.findAll(userId);
    }

    @Get('total-balance')
    async getTotalBalance(@CurrentUser('userId') userId: string): Promise<unknown> {
        return this.accountsService.getTotalBalance(userId);
    }

    @Get(':id')
    async findOne(
        @CurrentUser('userId') userId: string,
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<unknown> {
        return this.accountsService.findOne(userId, id);
    }

    @Patch(':id')
    async update(
        @CurrentUser('userId') userId: string,
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateAccountDto,
    ): Promise<unknown> {
        return this.accountsService.update(userId, id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(
        @CurrentUser('userId') userId: string,
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<{ message: string }> {
        await this.accountsService.remove(userId, id);
        return { message: 'Account deactivated successfully' };
    }
}
