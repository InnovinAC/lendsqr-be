import PasswordService from '@/services/password.service';
import bcrypt from 'bcrypt';

jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('PasswordService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash password successfully', async () => {
      const password = 'password123';
      const hashedPassword = 'hashed-password-123';

      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);

      const result = await PasswordService.hashPassword(password);

      expect(mockedBcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });

    it('should throw error when hashing fails', async () => {
      const password = 'password123';
      const error = new Error('Hashing failed');

      mockedBcrypt.hash.mockRejectedValue(error as never);

      await expect(PasswordService.hashPassword(password)).rejects.toThrow('Hashing failed');
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(password, 10);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching passwords', async () => {
      const password = 'password123';
      const hashedPassword = 'hashed-password-123';

      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await PasswordService.comparePassword(password, hashedPassword);

      expect(mockedBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      const password = 'password123';
      const hashedPassword = 'hashed-password-123';

      mockedBcrypt.compare.mockResolvedValue(false as never);

      const result = await PasswordService.comparePassword(password, hashedPassword);

      expect(mockedBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(false);
    });

    it('should throw error when comparison fails', async () => {
      const password = 'password123';
      const hashedPassword = 'hashed-password-123';
      const error = new Error('Comparison failed');

      mockedBcrypt.compare.mockRejectedValue(error as never);

      await expect(PasswordService.comparePassword(password, hashedPassword)).rejects.toThrow(
        'Comparison failed',
      );
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });
  });
});
