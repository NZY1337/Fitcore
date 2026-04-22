import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { UserSettings } from './entities/settings.entity';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserSettings])],
    controllers: [SettingsController],
    providers: [SettingsService, SupabaseAuthGuard],
    exports: [SettingsService],
})
export class SettingsModule { }