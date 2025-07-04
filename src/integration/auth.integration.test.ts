import request from 'supertest';
import express, { Router } from 'express';
import AuthenticationController from '@/controllers/auth/authentication.controller';

jest.mock('@/middleware/authentication/authentication.middleware', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      checkExistingEmail: (_req: any, _res: any, next: any) => next(),
    })),
  };
});

jest.mock('@/lib/api/request-validator.lib', () => {
  return {
    __esModule: true,
    default: {
      validate: () => (_req: any, _res: any, next: any) => next(),
    },
  };
});

jest.mock('@/validators/authentication.validator', () => ({
  __esModule: true,
  default: {
    REGISTER: {},
    LOGIN: {},
  },
}));

jest.mock('@/services/user.service', () => {
  return {
    __esModule: true,
    default: {
      getInstance: () => ({
        createUser: jest.fn().mockResolvedValue({ accessToken: 'jwt-token' }),
        loginUser: jest.fn().mockResolvedValue({ accessToken: 'jwt-token' }),
        isUniqueEmail: jest.fn().mockResolvedValue(true),
      }),
    },
  };
});

jest.mock('@/lib/api/response-handler.lib', () => {
  return {
    __esModule: true,
    default: {
      sendSuccess: jest.fn((res, message, status, data) => {
        return res.status(status).json({ message, data, success: true });
      }),
    },
  };
});

describe('AuthController Integration', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    const controller = new AuthenticationController();
    controller.initMiddleware();
    controller.initRoutes();
    app.use('/api/v1/auth', controller.router);
  });

  it('should register successfully', async () => {
    const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '1234567890',
        })
        .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Registration successful');
    expect(res.body.data.accessToken).toBe('jwt-token');
  });

  it('should login successfully', async () => {
    const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Login successful');
    expect(res.body.data.accessToken).toBe('jwt-token');
  });
});
