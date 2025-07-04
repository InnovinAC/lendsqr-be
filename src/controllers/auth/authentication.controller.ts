import Controller from '@/lib/controller/controller.lib';
import AuthenticationMiddleware from '@/middleware/authentication/authentication.middleware';
import { NextFunction, Request, Response, Router } from 'express';
import RequestValidator from '@/lib/api/request-validator.lib';
import authenticationSchema from '@/validators/authentication.validator';
import UserService from '@/services/user.service';
import ResponseHandler from '@/lib/api/response-handler.lib';
import createError from 'http-errors';
import { rateLimit, RateLimitRequestHandler } from 'express-rate-limit';
import { TypedRequest } from '@/index';
import { z } from 'zod';

class AuthenticationController extends Controller {
  private authenticationMiddleware!: AuthenticationMiddleware;
  private rateLimiter!: RateLimitRequestHandler;
  constructor() {
    super(Router());
  }

  initMiddleware(): void {
    this.authenticationMiddleware = new AuthenticationMiddleware();
    this.rateLimiter = rateLimit({
      windowMs: 1000 * 60 * 5, // 5 mins,
      limit: 10,
      legacyHeaders: false,
      handler(_req: Request, _res: Response, next: NextFunction): void {
        next(createError.TooManyRequests('Too many requests. Try again later.'));
      },
    });
    this.setControllerMiddleware(this.rateLimiter);
  }

  initRoutes(): void {
    this.registerUser();
    this.loginUser();
  }

  initServices(): void {}

  /**
   * @openapi
   * /auth/register:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Register a new user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *               - first_name
   *               - last_name
   *               - phone_number
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 minLength: 8
   *               first_name:
   *                 type: string
   *                 minLength: 3
   *               last_name:
   *                 type: string
   *                 minLength: 3
   *               phone_number:
   *                 type: string
   *     responses:
   *       201:
   *         description: Registration successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 accessToken:
   *                   type: string
   *       400:
   *         description: Validation error
   *       409:
   *         description: Email already exists
   */
  public registerUser() {
    this.router.post('/register', RequestValidator.validate(authenticationSchema.REGISTER));
    this.router.post('/register', this.authenticationMiddleware.checkExistingEmail);
    this.router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await UserService.getInstance().createUser(req.body);
        ResponseHandler.sendSuccess(res, 'Registration successful', 201, data);
      } catch (e: any) {
        next(createError(e));
      }
    });
  }

  /**
   * @openapi
   * /auth/login:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Login a user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 minLength: 8
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 accessToken:
   *                   type: string
   *       400:
   *         description: Invalid credentials
   *       429:
   *         description: Too many requests
   */
  public loginUser() {
    this.router.post('/login', RequestValidator.validate(authenticationSchema.LOGIN));
    this.router.post(
      '/login',
      async (
        req: TypedRequest<{}, z.infer<typeof authenticationSchema.LOGIN>>,
        res: Response,
        next: NextFunction,
      ) => {
        try {
          const data = await UserService.getInstance().loginUser(req.body);
          ResponseHandler.sendSuccess(res, 'Login successful', 200, data);
        } catch (e: any) {
          next(createError(e));
        }
      },
    );
  }
}

export default AuthenticationController;
