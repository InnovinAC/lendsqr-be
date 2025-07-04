import { Request, Response, NextFunction } from 'express';
import AuthenticationMiddleware from '@/middleware/authentication/authentication.middleware';
import UserService from '@/services/user.service';

jest.mock('@/services/user.service');

describe('AuthenticationMiddleware', () => {
    const middleware = new AuthenticationMiddleware();
    const mockRequest = { body: { email: 'test@example.com' } } as Partial<Request>;
    const mockResponse = {} as Partial<Response>;
    const next: NextFunction = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call next if email is unique', async () => {
        (UserService.getInstance as jest.Mock).mockReturnValue({
            isUniqueEmail: jest.fn().mockResolvedValue(true),
        });

        await middleware.checkExistingEmail(mockRequest as Request, mockResponse as Response, next);
        expect(next).toHaveBeenCalled();
    });

    it('should call next with error if email is not unique', async () => {
        (UserService.getInstance as jest.Mock).mockReturnValue({
            isUniqueEmail: jest.fn().mockResolvedValue(false),
        });

        await middleware.checkExistingEmail(mockRequest as Request, mockResponse as Response, next);
        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect((next as jest.Mock).mock.calls[0][0].message).toBe('Invalid email address');
    });

    it('should handle service error', async () => {
        const error = new Error('DB error');
        (UserService.getInstance as jest.Mock).mockReturnValue({
            isUniqueEmail: jest.fn().mockRejectedValue(error),
        });

        await middleware.checkExistingEmail(mockRequest as Request, mockResponse as Response, next);
        expect(next).toHaveBeenCalledWith(error);
    });
});
