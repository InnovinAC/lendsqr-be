import AuthService from '@/services/auth.service';
import JwtService from '@/services/jwt.service';


jest.mock('@/services/jwt.service');
const mockedJwtService = JwtService as jest.Mocked<typeof JwtService>;

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(() => {
        jest.clearAllMocks();
        authService = new AuthService();
    });

    describe('authenticate', () => {
        it('should authenticate user and return access token', () => {
            const userId = 1;
            const expectedToken = 'mocked-access-token';

            mockedJwtService.sign.mockReturnValue(expectedToken);

            const result = authService.authenticate(userId);

            expect(mockedJwtService.sign).toHaveBeenCalledWith(userId, '1h');
            expect(result).toEqual({ accessToken: expectedToken });
        });

        it('should handle different user IDs', () => {
            const userId = 2;
            const expectedToken = 'another-mocked-token';

            mockedJwtService.sign.mockReturnValue(expectedToken);

            const result = authService.authenticate(userId);

            expect(mockedJwtService.sign).toHaveBeenCalledWith(userId, '1h');
            expect(result).toEqual({ accessToken: expectedToken });
        });

        it('should throw error when JWT signing fails', () => {
            const userId = 1;
            const error = new Error('JWT signing failed');

            mockedJwtService.sign.mockImplementation(() => {
                throw error;
            });

            expect(() => authService.authenticate(userId)).toThrow('JWT signing failed');
            expect(mockedJwtService.sign).toHaveBeenCalledWith(userId, '1h');
        });
    });
});