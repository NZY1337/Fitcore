import { Controller, Get, Post, Body, Patch, Delete, UseGuards, Req, } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('user-profile')
@UseGuards(SupabaseAuthGuard)
export class UserProfileController {
    constructor(private readonly userProfileService: UserProfileService) { }

    @Post()
    create(@Req() req: Request & { user: { id: string } }, @Body() createUserProfileDto: CreateUserProfileDto) {
        return this.userProfileService.create(req.user.id, createUserProfileDto);
    }

    @Get()
    findOne(@Req() req: Request & { user: { id: string } }) {
        return this.userProfileService.findOne(req.user.id);
    }

    @Patch()
    update(@Req() req: Request & { user: { id: string } }, @Body() updateUserProfileDto: UpdateUserProfileDto) {
        return this.userProfileService.update(req.user.id, updateUserProfileDto);
    }

    @Delete()
    remove(@Req() req: Request & { user: { id: string } }) {
        return this.userProfileService.remove(req.user.id);
    }
}
