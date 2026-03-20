import {
    Controller,
    Post,
    Get,
    Patch,
    Body,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto, UpdateProfileDto } from './dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() dto: RegisterDto): Promise<unknown> {
        return this.authService.register(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto): Promise<unknown> {
        return this.authService.login(dto);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Body() dto: RefreshTokenDto): Promise<unknown> {
        return this.authService.refreshToken(dto);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async logout(@Body() body: RefreshTokenDto): Promise<{ message: string }> {
        await this.authService.logout(body.refreshToken);
        return { message: 'Logged out successfully' };
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getProfile(@CurrentUser('userId') userId: string): Promise<unknown> {
        return this.authService.getProfile(userId);
    }

    @Patch('me')
    @UseGuards(JwtAuthGuard)
    async updateProfile(
        @CurrentUser('userId') userId: string,
        @Body() dto: UpdateProfileDto,
    ): Promise<unknown> {
        return this.authService.updateProfile(userId, dto);
    }
}
