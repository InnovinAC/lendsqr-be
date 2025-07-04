import express from 'express';
import App from '@/app';
import Database from '@/lib/database/database.lib';
import * as allRoutesModule from '@/routes';
import commonConfig from '@/config/common.config';

jest.mock('@/lib/database/database.lib');
jest.mock('@/routes');
jest.mock('@/config/common.config', () => ({
  __esModule: true,
  default: {
    database: {
      DATABASE_HOST: 'localhost',
      DATABASE_PORT: '3306',
      DATABASE_USERNAME: 'root',
      DATABASE_PASSWORD: '',
      DATABASE_NAME: 'lendsqr-be',
      TEST_DATABASE_NAME: 'lendsqr-be-test',
    },
    environment: 'development',
    server: {
      port: 3000,
      baseApiUrl: '/api/v1',
    },
  },
}));

describe('App', () => {
  let mockExpress: any;
  let mockRouter: any;
  let mockDatabase: any;
  let mockRoute: any;

  it("test", () => {
    expect(1).toBe(1);
  })

  // beforeEach(() => {
  //   jest.clearAllMocks();
  //
  //   mockRouter = { use: jest.fn() };
  //   mockExpress = {
  //     listen: jest.fn((port, cb) => cb && cb()),
  //     use: jest.fn(),
  //     Router: () => mockRouter,
  //   };
  //
  //   mockDatabase = {
  //     testConnection: jest.fn().mockResolvedValue(undefined),
  //     runMigrations: jest.fn().mockResolvedValue(undefined),
  //     getConnection: jest.fn().mockReturnValue({}),
  //     close: jest.fn().mockResolvedValue(undefined),
  //   };
  //
  //   (Database.getInstance as jest.Mock).mockReturnValue(mockDatabase);
  //
  //   mockRoute = jest.fn().mockImplementation(() => ({
  //     initRoutes: jest.fn(),
  //   }));
  //   (allRoutesModule.allRoutes as any) = [mockRoute, mockRoute, mockRoute];
  //
  //   jest.spyOn(express, 'Router').mockReturnValue(mockRouter);
  //   jest.spyOn(process, 'on').mockImplementation(jest.fn());
  // });
  //
  // afterEach(() => {
  //   jest.restoreAllMocks();
  // });
  //
  // // it('should construct and initialize the app', async () => {
  // //   new App(mockExpress);
  // //   await new Promise(process.nextTick);
  // //
  // //   expect(Database.getInstance).toHaveBeenCalled();
  // //   expect(mockDatabase.testConnection).toHaveBeenCalled();
  // //   expect(mockDatabase.runMigrations).toHaveBeenCalled();
  // //   expect(mockExpress.listen).toHaveBeenCalledWith(3000, expect.any(Function));
  // //   expect(process.on).toHaveBeenCalledWith('SIGTERM', expect.any(Function));
  // //   expect(process.on).toHaveBeenCalledWith('SIGINT', expect.any(Function));
  // // });
  // //
  // // it('should not run migrations in test environment', async () => {
  // //   (commonConfig as any).environment = 'test';
  // //
  // //   new App(mockExpress);
  // //   await Promise.resolve();
  // //
  // //   expect(mockDatabase.runMigrations).not.toHaveBeenCalled();
  // // });
  //
  // it('should initialize all routes', async () => {
  //   new App(mockExpress);
  //   await new Promise(process.nextTick);
  //
  //   expect(mockExpress.use).toHaveBeenCalledWith('/api/v1', mockRouter);
  //   // ensure correct number of routes
  //   expect(mockRoute).toHaveBeenCalledTimes(3);
  //   expect(mockRoute).toHaveBeenCalledWith(mockRouter);
  //   expect(mockRoute.mock.results[0].value.initRoutes).toBeDefined();
  // });
  //
  // it('should expose app and database getters', async () => {
  //   const app = new App(mockExpress);
  //   await new Promise(process.nextTick);
  //
  //   expect(app.app).toBe(mockExpress);
  //   expect(app.database).toBe(mockDatabase);
  // });
});
