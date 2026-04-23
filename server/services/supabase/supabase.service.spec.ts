import { Test } from "@nestjs/testing";
import { SupabaseService } from "./supabase.service";

const getUserMock = jest.fn();

jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn(() => ({
        auth: { getUser: getUserMock },
    })),
}));

describe('SupabaseService', () => {
    let service: SupabaseService;

    beforeEach(async () => {
        getUserMock.mockReset();

        const module = await Test.createTestingModule({
            providers: [SupabaseService],
        }).compile();

        service = module.get<SupabaseService>(SupabaseService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return user data for a valid token', async () => {
        const mockUser = { id: 'user-1', email: 'test@example.com' };
        getUserMock.mockResolvedValue({ data: { user: mockUser }, error: null });

        const result = await service.getUser('valid-token');
        expect(result.data.user).toEqual(mockUser);
        expect(getUserMock).toHaveBeenCalledWith('valid-token');
    });

    it('should return error for an invalid token', async () => {
        getUserMock.mockResolvedValue({ data: { user: null }, error: { message: 'Invalid token' } });

        const result = await service.getUser('invalid-token');
        expect(result.error).toBeDefined();
        expect(result.data.user).toBeNull();
    });
});
