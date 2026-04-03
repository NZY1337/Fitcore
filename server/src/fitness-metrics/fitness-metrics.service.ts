import { Injectable, NotFoundException } from '@nestjs/common';
import { UserProfileService } from '../user-profile/user-profile.service';
import {
    calculateBMI,
    calculateBMR,
    calculateTDEE,
    calculateCaloriesTarget,
    calculateMacros,
    calculateBodyFat,
    calculateHeartRateZones,
} from '../algorythm';

@Injectable()
export class FitnessMetricsService {
    constructor(private readonly userProfileService: UserProfileService) { }

    async getMetrics(userId: string): Promise<any> {
        const userProfile = await this.userProfileService.findOne(userId);

        if (!userProfile) {
            throw new NotFoundException('User profile not found');
        }

        const {
            gender,
            weight_kg,
            height_cm,
            waist_cm,
            neck_cm,
            hip_cm,
            date_of_birth,
            activity_level,
            activity_goal,
        } = userProfile;

        const age = Math.floor((new Date().getTime() - new Date(date_of_birth).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
        const bmi = calculateBMI(weight_kg, height_cm);
        const bmr = calculateBMR({ weight: weight_kg, height: height_cm, gender, age });
        const tdee = calculateTDEE({ bmr, activityLevel: activity_level });
        const caloriesTarget = calculateCaloriesTarget({ tdee, goal: activity_goal });
        const macros = calculateMacros(caloriesTarget, weight_kg);
        const bodyFat = calculateBodyFat({ waistCm: waist_cm, neckCm: neck_cm, heightCm: height_cm, hipCm: hip_cm, gender });
        const heartRateZones = calculateHeartRateZones(age);

        return { bmi, bmr, tdee, caloriesTarget, macros, bodyFat, heartRateZones };
    }
}
