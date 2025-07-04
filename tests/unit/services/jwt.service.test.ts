import JwtService from '@/services/jwt.service';
import jwt from 'jsonwebtoken';
import commonConfig from '@/config/common.config';

jest.mock('jsonwebtoken');
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('JwtService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sign', () => {
    it('should sign a token with userId, sessionId, and expiry', () => {
      const userId = 1;
      const sessionId = 42;
      const expiry = '1h';
      const expectedToken = 'mocked-jwt-token';

      mockedJwt.sign.mockReturnValue(expectedToken as any);

      const result = JwtService.sign(userId, sessionId, expiry);

      expect(mockedJwt.sign).toHaveBeenCalledWith({ userId, sessionId }, commonConfig.jwt.secret, {
        expiresIn: expiry,
      });
      expect(result).toBe(expectedToken);
    });
  });

  describe('verify', () => {
    it('should verify a valid token', () => {
      const token = 'valid-jwt-token';
      const expectedPayload = { userId: 1, sessionId: 42, iat: 1234567890 };

      mockedJwt.verify.mockReturnValue(expectedPayload as any);

      const result = JwtService.verify(token);

      expect(mockedJwt.verify).toHaveBeenCalledWith(token, commonConfig.jwt.secret);
      expect(result).toEqual(expectedPayload);
    });

    it('should throw error for invalid token', () => {
      const token = 'invalid-jwt-token';
      const error = new Error('Invalid token');

      mockedJwt.verify.mockImplementation(() => {
        throw error;
      });

      expect(() => JwtService.verify(token)).toThrow('Invalid token');
      expect(mockedJwt.verify).toHaveBeenCalledWith(token, commonConfig.jwt.secret);
    });

    it('should throw error for expired token', () => {
      const token = 'expired-jwt-token';
      const error = new Error('TokenExpiredError');

      mockedJwt.verify.mockImplementation(() => {
        throw error;
      });

      expect(() => JwtService.verify(token)).toThrow('TokenExpiredError');
      expect(mockedJwt.verify).toHaveBeenCalledWith(token, commonConfig.jwt.secret);
    });
  });
});
