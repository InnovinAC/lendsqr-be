import AuthService from '@/services/auth.service';
import JwtService from '@/services/jwt.service';
import SessionService from '@/services/session.service';

jest.mock('@/services/jwt.service');
jest.mock('@/services/session.service');
const mockedJwtService = JwtService as jest.Mocked<typeof JwtService>;

let mockCreateSession: jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockCreateSession = jest.fn();
  jest
    .spyOn(SessionService, 'getInstance')
    .mockReturnValue({ createSession: mockCreateSession } as any);
});

describe('AuthService', () => {
  describe('authenticate', () => {
    it('should authenticate user, create session, and return access token', async () => {
      const userId = 1;
      const sessionId = 42;
      const expectedToken = 'mocked-access-token';
      const fakeSession = { id: sessionId };

      mockCreateSession.mockResolvedValue(fakeSession);
      mockedJwtService.sign.mockReturnValue(expectedToken);

      const authService = new AuthService();
      const result = await authService.authenticate(userId);

      expect(mockCreateSession).toHaveBeenCalledWith(userId, expect.any(Date));
      expect(mockedJwtService.sign).toHaveBeenCalledWith(userId, sessionId, '1h');
      expect(result).toEqual({ accessToken: expectedToken });
    });

    it('should throw error when session creation fails', async () => {
      const userId = 1;
      mockCreateSession.mockRejectedValue(new Error('fail'));
      const authService = new AuthService();
      await expect(authService.authenticate(userId)).rejects.toThrow('fail');
    });
  });
});
