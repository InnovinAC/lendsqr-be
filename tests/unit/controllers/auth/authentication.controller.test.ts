import request from 'supertest';
import express from 'express';
import UserService from '@/services/user.service';
import ResponseHandler from '@/lib/api/response-handler.lib';
import createError from 'http-errors';
import AuthenticationController from "@/controllers/auth/authentication.controller";

jest.mock('@/services/user.service');
jest.mock('@/lib/api/response-handler.lib');


jest.mock('@/middleware/authentication/authentication.middleware', () => {
  return jest.fn().mockImplementation(() => ({
    checkExistingEmail: (_req: any, _res: any, next: any) => next(),
  }));
});

jest.mock('@/lib/api/request-validator.lib', () => ({
  __esModule: true,
  default: {
    validate: () => (_req: any, _res: any, next: any) => next(),
  },
}));


jest.mock('@/validators/authentication.validator');

const mockedUserService = UserService as jest.Mocked<typeof UserService>;
const mockedResponseHandler = ResponseHandler as jest.Mocked<typeof ResponseHandler>;

describe('AuthenticationController (via AuthRoute)', () => {
  let app: express.Express;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());

    app.use('/api/v1/auth', new AuthenticationController().router);

    mockedResponseHandler.sendSuccess.mockImplementation((res, message, status, data) => {
      return res.status(status as number).json({ message, data });
    });
  });

  describe('POST /auth/register', () => {
    it('should register a user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
      };

      const authResult = { accessToken: 'jwt-token' };

      mockedUserService.getInstance.mockReturnValue({
        createUser: jest.fn().mockResolvedValue(authResult),
      } as any);

      const response = await request(app).post('/api/v1/auth/register').send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        message: 'Registration successful',
        data: authResult,
      });

      expect(mockedUserService.getInstance).toHaveBeenCalled();
      expect(mockedResponseHandler.sendSuccess).toHaveBeenCalledWith(
          expect.any(Object),
          'Registration successful',
          201,
          authResult
      );
    });

    it('should handle registration error', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
      };

      const error = new Error('Registration failed');

      mockedUserService.getInstance.mockReturnValue({
        createUser: jest.fn().mockRejectedValue(error),
      } as any);

      const response = await request(app).post('/api/v1/auth/register').send(userData);

      expect(response.status).toBe(500);
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const authResult = { accessToken: 'jwt-token' };

      mockedUserService.getInstance.mockReturnValue({
        loginUser: jest.fn().mockResolvedValue(authResult),
      } as any);

      const response = await request(app).post('/api/v1/auth/login').send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Login successful',
        data: authResult,
      });

      expect(mockedUserService.getInstance).toHaveBeenCalled();
    });

    it('should handle login error', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      const error = createError.BadRequest('Incorrect email or password');

      mockedUserService.getInstance.mockReturnValue({
        loginUser: jest.fn().mockRejectedValue(error),
      } as any);

      const response = await request(app).post('/api/v1/auth/login').send(loginData);

      expect(response.status).toBe(400);
    });

    it('should rate limit login requests', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrong-password',
      };
      await request(app).post('/api/v1/auth/login').send(loginData)
      await request(app).post('/api/v1/auth/login').send(loginData)
      await request(app).post('/api/v1/auth/login').send(loginData)
      await request(app).post('/api/v1/auth/login').send(loginData)
      await request(app).post('/api/v1/auth/login').send(loginData)
      await request(app).post('/api/v1/auth/login').send(loginData)
      await request(app).post('/api/v1/auth/login').send(loginData)
      await request(app).post('/api/v1/auth/login').send(loginData)
      await request(app).post('/api/v1/auth/login').send(loginData)
      await request(app).post('/api/v1/auth/login').send(loginData)
      await request(app).post('/api/v1/auth/login').send(loginData).expect(429);

    })

    it('should rate limit register requests', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrong-password',
      };
      await request(app).post('/api/v1/auth/register').send(loginData)
      await request(app).post('/api/v1/auth/register').send(loginData)
      await request(app).post('/api/v1/auth/register').send(loginData)
      await request(app).post('/api/v1/auth/register').send(loginData)
      await request(app).post('/api/v1/auth/register').send(loginData)
      await request(app).post('/api/v1/auth/register').send(loginData)
      await request(app).post('/api/v1/auth/register').send(loginData)
      await request(app).post('/api/v1/auth/register').send(loginData)
      await request(app).post('/api/v1/auth/register').send(loginData)
      await request(app).post('/api/v1/auth/register').send(loginData)
      await request(app).post('/api/v1/auth/register').send(loginData).expect(429);

    })
  });
}); 