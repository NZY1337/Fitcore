import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';

@Injectable()
export class UserSyncInterceptor implements NestInterceptor {
    private readonly logger = new Logger(UserSyncInterceptor.name);

    constructor(private readonly userService: UserService) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (user) {
            try {
                await this.userService.upsertUser(user);
            } catch (error) {
                this.logger.error(`Failed to upsert user ${user.id}: ${error.message}`, error.stack);
            }
        }

        return next.handle();
    }
}