import SessionService from '@/services/session.service';

describe('SessionService', () => {
  let service: SessionService;
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      table: jest.fn().mockReturnThis(),
      insert: jest.fn(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      first: jest.fn(),
      update: jest.fn(),
      fn: { now: jest.fn() },
    };
    service = new SessionService();
    (service as any).db = mockDb;
  });

  it('should create a session and return it', async () => {
    mockDb.insert.mockResolvedValue([1]);
    mockDb.first.mockResolvedValue({ id: 1 });
    const result = await service.createSession(1, new Date());
    expect(result).toEqual({ id: 1 });
  });

  it('should find a session by id', async () => {
    mockDb.first.mockResolvedValue({ id: 2 });
    const result = await service.findSessionById(2);
    expect(result).toEqual({ id: 2 });
  });

  it('should find an active session', async () => {
    mockDb.first.mockResolvedValue({ id: 3 });
    const result = await service.findActiveSession(3);
    expect(result).toEqual({ id: 3 });
  });

  it('should extend a session', async () => {
    mockDb.update.mockResolvedValue(undefined);
    await service.extendSession(4, new Date());
    expect(mockDb.update).toHaveBeenCalled();
  });

  it('should revoke a session', async () => {
    mockDb.update.mockResolvedValue(undefined);
    await service.revokeSession(5);
    expect(mockDb.update).toHaveBeenCalled();
  });
});
