import UserService from '@/services/user.service';
import PasswordService from '@/services/password.service';
import AuthService from '@/services/auth.service';
import { ICreateUser, ILogin } from '@/interfaces/user.interface';
import { User } from '@/models';
import createError from 'http-errors';


jest.mock('@/services/password.service');
jest.mock('@/services/auth.service');
jest.mock('@/lib/service/service.lib');

const mockedPasswordService = PasswordService as jest.Mocked<typeof PasswordService>;
const mockedAuthService = AuthService as jest.Mocked<typeof AuthService>;

describe('UserService', () => {
  let userService: UserService;
  let mockDb: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockDb = {
      table: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      first: jest.fn(),
      transaction: jest.fn(),
      insert: jest.fn(),
    };


    userService = new UserService();
    (userService as any).db = mockDb;
  });

  describe('findUserByEmail', () => {
    it('should find user by email', async () => {
      const email = 'test@example.com';
      const mockUser: User = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed-password',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        isBlacklisted: false,
        blacklistReason: '',
        blacklistedAt: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockDb.first.mockResolvedValue(mockUser);

      const result = await userService.findUserByEmail(email);

      expect(mockDb.table).toHaveBeenCalledWith('users');
      expect(mockDb.where).toHaveBeenCalledWith('email', email);
      expect(mockDb.first).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      const email = 'nonexistent@example.com';

      mockDb.first.mockResolvedValue(null);

      const result = await userService.findUserByEmail(email);

      expect(result).toBeNull();
    });
  });

  describe('findUserById', () => {
    it('should find user by id', async () => {
      const userId = 'user-id';
      const mockUser: User = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed-password',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        isBlacklisted: false,
        blacklistReason: '',
        blacklistedAt: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockDb.first.mockResolvedValue(mockUser);

      const result = await userService.findUserById(userId);

      expect(mockDb.table).toHaveBeenCalledWith('users');
      expect(mockDb.where).toHaveBeenCalledWith('id', userId);
      expect(mockDb.first).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe('isUniqueEmail', () => {
    it('should return true for unique email', async () => {
      const email = 'unique@example.com';

      mockDb.first.mockResolvedValue(null);

      const result = await userService.isUniqueEmail(email);

      expect(result).toBe(true);
    });

    it('should return false for existing email', async () => {
      const email = 'existing@example.com';
      const mockUser = { id: 'user-id', email };

      mockDb.first.mockResolvedValue(mockUser);

      const result = await userService.isUniqueEmail(email);

      expect(result).toBe(false);
    });
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const userData: ICreateUser = {
        email: 'new@example.com',
        password: 'password123',
        first_name: 'Jane',
        last_name: 'Smith',
        phone_number: '9876543210',
      };

      const hashedPassword = 'hashed-password-123';
      const authResult = { accessToken: 'jwt-token' };

      mockedPasswordService.hashPassword.mockResolvedValue(hashedPassword);
      mockedAuthService.getInstance.mockReturnValue({
        authenticate: jest.fn().mockReturnValue(authResult),
      } as any);


      const mockTransaction = jest.fn().mockImplementation(async (callback) => {
        await callback({
          table: jest.fn().mockReturnThis(),
          insert: jest.fn().mockResolvedValue([1]),
        });
      });
      mockDb.transaction.mockImplementation(mockTransaction);

      const result = await userService.createUser(userData);
      expect(userData.password).toEqual(hashedPassword);
      expect(mockedPasswordService.hashPassword).toHaveBeenCalled();
      expect(userData.password).toEqual(hashedPassword);
      expect(mockDb.transaction).toHaveBeenCalled();
      expect(result).toEqual(authResult);
    });

    it('should throw error when password hashing fails', async () => {
      const userData: ICreateUser = {
        email: 'new@example.com',
        password: 'password123',
        first_name: 'Jane',
        last_name: 'Smith',
        phone_number: '9876543210',
      };

      const error = new Error('Hashing failed');
      mockedPasswordService.hashPassword.mockRejectedValue(error);

      await expect(userService.createUser(userData)).rejects.toThrow('Hashing failed');
    });
  });

  describe('loginUser', () => {
    it('should login user successfully', async () => {
      const loginData: ILogin = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser: User = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed-password',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        isBlacklisted: false,
        blacklistReason: '',
        blacklistedAt: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      const authResult = { accessToken: 'jwt-token' };

      mockDb.first.mockResolvedValue(mockUser);
      mockedPasswordService.comparePassword.mockResolvedValue(true);
      mockedAuthService.getInstance.mockReturnValue({
        authenticate: jest.fn().mockReturnValue(authResult),
      } as any);

      const result = await userService.loginUser(loginData);

      expect(mockedPasswordService.comparePassword).toHaveBeenCalledWith(
        loginData.password,
        mockUser.password
      );
      expect(result).toEqual(authResult);
    });

    it('should throw error for non-existent user', async () => {
      const loginData: ILogin = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockDb.first.mockResolvedValue(null);

      await expect(userService.loginUser(loginData)).rejects.toThrow(
        createError.BadRequest('Incorrect email or password')
      );
    });

    it('should throw error for invalid password', async () => {
      const loginData: ILogin = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      const mockUser: User = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed-password',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        isBlacklisted: false,
        blacklistReason: '',
        blacklistedAt: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockDb.first.mockResolvedValue(mockUser);
      mockedPasswordService.comparePassword.mockResolvedValue(false);

      await expect(userService.loginUser(loginData)).rejects.toThrow(
      );
    });
  });
}); 