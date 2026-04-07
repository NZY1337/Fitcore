import { Test } from "@nestjs/testing";
import { FitnessMetricsService } from "./fitness-metrics.service";
import { UserProfileService } from "../user-profile/user-profile.service";
import { NotFoundException } from "@nestjs/common";

describe('FitnessMetricsService', () => {
    let fitnessMetricsService: FitnessMetricsService;
    let findOneMock: jest.Mock;

    const mockUserProfile = {
        user_id: 'user-id',
        gender: 'male',
        weight_kg: 70,
        height_cm: 175,
        waist_cm: 80,
        neck_cm: 40,
        hip_cm: 90,
        date_of_birth: '1990-01-01',
        activity_level: 'moderate',
        activity_goal: 'maintain',
    };

    beforeEach(async () => {
        findOneMock = jest.fn();

        const module = await Test.createTestingModule({
            providers: [
                FitnessMetricsService,
                {
                    provide: UserProfileService,
                    useValue: { findOne: findOneMock },
                },
            ],
        }).compile();

        fitnessMetricsService = module.get<FitnessMetricsService>(FitnessMetricsService);
    });

    it('should return fitness metrics for valid user profile', async () => {
        findOneMock.mockResolvedValue(mockUserProfile);
        const metrics = await fitnessMetricsService.getMetrics(mockUserProfile.user_id);
        expect(metrics).toHaveProperty('bmi');
        expect(metrics).toHaveProperty('bmr');
        expect(metrics).toHaveProperty('tdee');
        expect(metrics).toHaveProperty('caloriesTarget');
        expect(metrics).toHaveProperty('macros');
        expect(metrics).toHaveProperty('bodyFat');
        expect(metrics).toHaveProperty('heartRateZones');
    });

    it('should throw NotFoundException when user profile does not exist', async () => {
        findOneMock.mockResolvedValue(null);
        await expect(fitnessMetricsService.getMetrics('unknown-id')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when neck_cm > waist_cm', async () => {
        const invalidProfile = { ...mockUserProfile, neck_cm: 85 };
        findOneMock.mockResolvedValue(invalidProfile);
        await expect(fitnessMetricsService.getMetrics('user-id')).rejects.toThrow('Waist must be greater than neck measurement');
    })

    it('should throw BadRequestException when weight_kg <=0', async () => {
        const invalidProfile = { ...mockUserProfile, weight_kg: 0 };
        findOneMock.mockResolvedValue(invalidProfile);
        await expect(fitnessMetricsService.getMetrics('user-id')).rejects.toThrow('Weight must be greater than zero.');
    })

    it('should throw BadRequestException when height_cm <=0', async () => {
        const invalidProfile = { ...mockUserProfile, height_cm: 0 };
        findOneMock.mockResolvedValue(invalidProfile);
        await expect(fitnessMetricsService.getMetrics('user-id')).rejects.toThrow('Height must be greater than zero.');
    });

    // Add more tests for other edge cases as needed
});