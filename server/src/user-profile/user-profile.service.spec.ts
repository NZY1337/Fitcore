import { Test } from "@nestjs/testing";
import { UserProfileService } from "./user-profile.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserProfile } from "./entities/user-profile.entity";
import { CreateUserProfileDto } from "./dto/create-user-profile.dto";
import { BadRequestException } from "@nestjs/common";
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto";

describe('UserProfileService', () => {
    let userProfileService: UserProfileService;
    let createMock: jest.Mock;
    let saveMock: jest.Mock;
    let findOneMock: jest.Mock;
    let findOneByMock: jest.Mock;
    let mergeMock: jest.Mock;
    let updateMock: jest.Mock;
    let deleteMock: jest.Mock;

    beforeEach(async () => {
        createMock = jest.fn();
        saveMock = jest.fn();
        findOneMock = jest.fn();
        findOneByMock = jest.fn();
        mergeMock = jest.fn();
        updateMock = jest.fn();
        deleteMock = jest.fn();

        const module = await Test.createTestingModule({
            providers: [
                UserProfileService,
                {
                    provide: getRepositoryToken(UserProfile),
                    useValue: {
                        create: createMock,
                        save: saveMock,
                        findOne: findOneMock,
                        findOneBy: findOneByMock,
                        merge: mergeMock,
                        update: updateMock,
                        delete: deleteMock,
                    },
                },
            ],
        }).compile();

        userProfileService = module.get<UserProfileService>(UserProfileService);
    });

    it('should be defined', () => {
        expect(userProfileService).toBeDefined();
    });

    it('should create user profile with valid data', async () => {
        const dto: CreateUserProfileDto = {
            gender: 'male',
            weight_kg: 70,
            height_cm: 175,
            waist_cm: 80,
            neck_cm: 40,
            hip_cm: 90,
            date_of_birth: '1990-01-06',
            activity_level: 'sedentary',
        } as CreateUserProfileDto;

        const expectedProfile = { ...dto, user_id: 'user-id' };
        createMock.mockReturnValue(expectedProfile);
        saveMock.mockResolvedValue(expectedProfile);

        const userProfile = await userProfileService.create('user-id', dto);
        expect(userProfile).toEqual(expectedProfile);
    });

    it('should update user profile with valid data', async () => {
        const existingProfile = {
            user_id: 'user-id',
            gender: 'male',
            weight_kg: 70,
            height_cm: 175,
            waist_cm: 80,
            neck_cm: 40,
            hip_cm: 90,
            date_of_birth: '1990-01-06',
            activity_level: 'sedentary',
        };

        const updateDto = {
            weight_kg: 75,
            activity_level: 'moderately_active',
        } as Partial<CreateUserProfileDto>;

        const updatedProfile: UpdateUserProfileDto = { ...existingProfile, ...updateDto } as UpdateUserProfileDto;

        findOneByMock.mockResolvedValue(existingProfile);
        mergeMock.mockReturnValue(updatedProfile);
        saveMock.mockResolvedValue(updatedProfile);

        const result = await userProfileService.update('user-id', updatedProfile);
        expect(result).toEqual(updatedProfile);
    });

    it('should remove user profile', async () => {
        deleteMock.mockResolvedValue(undefined);
        await userProfileService.remove('user-id');
        expect(deleteMock).toHaveBeenCalledWith({ user_id: 'user-id' });
    });

    it('should throw BadRequestException for invalid measurements: neck_cm > waist_cm', async () => {
        const dto: CreateUserProfileDto = {
            gender: 'male',
            weight_kg: 70,
            height_cm: 175,
            waist_cm: 80,
            neck_cm: 100,
            hip_cm: 90,
            date_of_birth: '1990-01-06',
            activity_level: 'sedentary',
        } as CreateUserProfileDto;

        await expect(async () => {
            await userProfileService.create('user-id', dto);
        }).rejects.toThrow('Waist must be greater than neck measurement');
    });

});