import request from 'supertest';
import express from 'express';
import ProfileController from '@/controllers/user/profile.controller';

jest.mock('@/middleware/authorization/authorization.middleware', () => {
  return jest.fn().mockImplementation(() => ({
    authorizeUser: jest.fn().mockImplementation((req: any, res: any, next: any) => {
      req.user = {
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+1234567890',
        isBlacklisted: false,
        blacklistReason: '',
        blacklistedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      next();
    }),
  }));
});

describe('ProfileController', () => {
  let app: express.Application;
  let controller: ProfileController;

  beforeEach(() => {
    app = express();
    controller = new ProfileController();
    controller.initRoutes();
    app.use(controller.router);
  });

  describe('GET /', () => {
    it('should return user profile successfully', async () => {
      const res = await request(app).get('/');

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body.message).toBe('User Profile');
      expect(res.body.data).toEqual({
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+1234567890',
        isBlacklisted: false,
        blacklistReason: '',
        blacklistedAt: null,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should handle server errors', async () => {
      const originalSendSuccess = require('@/lib/api/response-handler.lib').default.sendSuccess;
      require('@/lib/api/response-handler.lib').default.sendSuccess = jest
        .fn()
        .mockImplementation(() => {
          throw new Error('Server error');
        });

      const res = await request(app).get('/');

      expect(res.status).toBe(500);

      require('@/lib/api/response-handler.lib').default.sendSuccess = originalSendSuccess;
    });
  });
});
