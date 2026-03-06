import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../config/configuration';

interface JwtPayload {
    sub: string;
    email: string;
    type: string;
    iat: number;
    exp: number;
    iss: string;
    aud: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(configService: ConfigService<AppConfig, true>) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('jwt.publicKey', { infer: true }),
            algorithms: ['RS256'] as const,
            issuer: 'budget-pro-api',
            audience: 'budget-pro-mobile',
        });
    }

    validate(payload: JwtPayload): { userId: string; email: string } {
        if (payload.type !== 'access') {
            throw new UnauthorizedException('Invalid token type');
        }

        return { userId: payload.sub, email: payload.email };
    }
}
