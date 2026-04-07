import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from './entities/user-profile.entity';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { calculateBodyFat } from '../algorythm';

@Injectable()
export class UserProfileService {
    constructor(@InjectRepository(UserProfile) private repo: Repository<UserProfile>) { }

    private validateProfileForMetrics(profile: {
        waist_cm: number;
        neck_cm: number;
        height_cm: number;
        hip_cm: number;
        gender: 'male' | 'female';
    }): void {
        try {
            calculateBodyFat({
                waistCm: profile.waist_cm,
                neckCm: profile.neck_cm,
                heightCm: profile.height_cm,
                hipCm: profile.hip_cm,
                gender: profile.gender,
            });
        } catch (error) {
            const message = error instanceof Error && error.message;
            throw new BadRequestException(message);
        }
    }

    create(userId: string, dto: CreateUserProfileDto): Promise<UserProfile> {
        this.validateProfileForMetrics(dto);
        const profile = this.repo.create({ ...dto, user_id: userId });
        return this.repo.save(profile);
    }

    async findOne(userId: string): Promise<UserProfile> {
        const profile = await this.repo.findOneBy({ user_id: userId });
        if (!profile) throw new NotFoundException('User profile not found');
        return profile;
    }

    async update(userId: string, attrs: UpdateUserProfileDto): Promise<UserProfile> {
        const userProfile = await this.findOne(userId);
        if (!userProfile) throw new NotFoundException('User profile not found');

        const updatedProfile = this.repo.merge(userProfile, attrs);
        this.validateProfileForMetrics(updatedProfile);
        return this.repo.save(updatedProfile);
    }

    async remove(userId: string): Promise<void> {
        await this.repo.delete({ user_id: userId });
    }
}
