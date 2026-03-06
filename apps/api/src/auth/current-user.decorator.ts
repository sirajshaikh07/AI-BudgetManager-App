import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface AuthenticatedRequest {
    user: {
        userId: string;
        email: string;
    };
}

export const CurrentUser = createParamDecorator(
    (data: keyof AuthenticatedRequest['user'] | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
        const user = request.user;

        return data ? user[data] : user;
    },
);
