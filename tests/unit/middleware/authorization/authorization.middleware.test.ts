import AuthorizationMiddleware from '@/middleware/authorization/authorization.middleware';
import JwtService from '@/services/jwt.service';
import SessionService from '@/services/session.service';
import UserService from '@/services/user.service';

jest.mock('@/services/jwt.service');
jest.mock('@/services/session.service');
jest.mock('@/services/user.service');

const mockedJwtService = JwtService as jest.Mocked<typeof JwtService>;
const mockedUserService = UserService as jest.Mocked<typeof UserService>;

describe('AuthorizationMiddleware', () => {
  let middleware: AuthorizationMiddleware;
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    jest.clearAllMocks();
    middleware = new AuthorizationMiddleware();
    req = { headers: { authorization: 'Bearer validtoken' } };
    res = {};
    next = jest.fn();
    (middleware as any).sessionService = {
      findActiveSession: jest.fn(),
      extendSession: jest.fn(),
    };
  });

  it('should allow request and extend session if session is valid', async () => {
    mockedJwtService.verify.mockReturnValue({ userId: 1, sessionId: 2 });
    (middleware as any).sessionService.findActiveSession.mockResolvedValue({
      id: 2,
      expires_at: new Date(),
    });
    (middleware as any).sessionService.extendSession.mockResolvedValue(undefined);
    mockedUserService.prototype.findUserById = jest
      .fn()
      .mockResolvedValue({ id: 1, email: 'a', password: 'b' });

    await middleware.authorizeUser(req, res, next);
    expect((middleware as any).sessionService.extendSession).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith();
  });

  it('should deny request if session is expired or revoked', async () => {
    mockedJwtService.verify.mockReturnValue({ userId: 1, sessionId: 2 });
    (middleware as any).sessionService.findActiveSession.mockResolvedValue(undefined);

    await middleware.authorizeUser(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toMatch(/Session expired or revoked/);
  });
});
