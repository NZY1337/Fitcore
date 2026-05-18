import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

type AuthReq = { user: { id: string } };

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('me')
    @UseGuards(SupabaseAuthGuard)
    getMe(@Req() req: AuthReq) {
        return this.userService.findById(req.user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findById(id);
    }
}
