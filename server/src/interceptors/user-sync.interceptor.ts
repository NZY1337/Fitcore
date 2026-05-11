import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from '../user/user.service';

@Injectable()
export class UserSyncInterceptor implements NestInterceptor {
    constructor(private readonly userService: UserService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const user = request.user; // set by your auth guard

        if (user) {
            this.userService.upsertUser(user);
        }

        return next.handle();

        // const now = Date.now();

        // return next
        //     .handle()
        //     .pipe(
        //         tap(() => console.log(`After... ${Date.now() - now}ms`)),
        //     );
    }
}