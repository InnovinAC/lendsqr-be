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
      const userId = 'test-user-id';
      const expectedToken = 'mocked-access-token';

      mockedJwtService.sign.mockReturnValue(expectedToken);

      const result = authService.authenticate(userId);

      expect(mockedJwtService.sign).toHaveBeenCalledWith(userId, '1h');
      expect(result).toEqual({ accessToken: expectedToken });
    });

    it('should handle different user IDs', () => {
      const userId = 'another-user-id';
      const expectedToken = 'another-mocked-token';

      mockedJwtService.sign.mockReturnValue(expectedToken);

      const result = authService.authenticate(userId);

      expect(mockedJwtService.sign).toHaveBeenCalledWith(userId, '1h');
      expect(result).toEqual({ accessToken: expectedToken });
    });

    it('should throw error when JWT signing fails', () => {
      const userId = 'test-user-id';
      const error = new Error('JWT signing failed');

      mockedJwtService.sign.mockImplementation(() => {
        throw error;
      });

      expect(() => authService.authenticate(userId)).toThrow('JWT signing failed');
      expect(mockedJwtService.sign).toHaveBeenCalledWith(userId, '1h');
    });
  });
}); 