import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from '../utils/constants';
import { UserService } from '../user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly userService: UserService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // No @Roles() decorator on this handler — let it through
        if (!requiredRoles || requiredRoles.length === 0) return true;

        const request = context.switchToHttp().getRequest();
        const userId: string | undefined = request.user?.id;

        if (!userId) throw new ForbiddenException('No authenticated user');

        const user = await this.userService.findById(userId);
        if (!user) throw new ForbiddenException('User not found');

        if (!requiredRoles.includes(user.role)) {
            throw new ForbiddenException(`Access restricted to: ${requiredRoles.join(', ')}`);
        }

        // Attach role to request.user so controllers can read it without another DB call
        request.user.role = user.role;
        return true;
    }
}
