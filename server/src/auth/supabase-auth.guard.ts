import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../../services/supabase/supabase.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
    constructor(private readonly supabase: SupabaseService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader: string | undefined = request.headers['authorization'];

        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing or invalid Authorization header');
        }

        const token = authHeader.slice(7);
        const { data: { user }, error } = await this.supabase.getUser(token);

        if (error || !user) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        request.user = { id: user.id, email: user.email };
        return true;
    }
}
