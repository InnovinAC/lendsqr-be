import { Express, NextFunction, Router, Request, Response } from 'express';
import commonConfig from '@/config/common.config';
import { allRoutes } from '@/routes';
import Database from '@/lib/database/database.lib';
import logger from '@/utils/logger.utils';
import ResponseHandler from '@/lib/api/response-handler.lib';
import swaggerJSDoc from 'swagger-jsdoc';
import SwaggerUI from "swagger-ui-express"
import swaggerOptions from './docs/swagger.options';

class App {
  private readonly _app: Express;
  private _database: Database | undefined;

  constructor(express: Express) {
    this._app = express;
    this.initialize();
  }

  /**
   * Responsible for initializing the entire app
   */
  private async initialize() {
    await this.initDatabase();
    this.initRoutes();
    this.listen(commonConfig.server.port);
    this.setupGracefulShutdown();
    this.setupSwagger();
  }

  private listen(port: string | number) {
    this._app.listen(port, () => {
      logger.info(`Listening on port ${port}`);
    });
  }

  /**
   * Responsible for initializing all defined app routes
   * and ensuring they have the same router instance
   */
  private initRoutes() {
    const router = Router();
    this._app.use(commonConfig.server.baseApiUrl, router);
    allRoutes.forEach((route) => {
      logger.info(`Initializing route ${route.name}`);
      new route(router).initRoutes();
    });
    // Global error handler
    router.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      if (
        err.message.includes('ER_') || // MySQL error codes
        err.message.includes('syntax error') || // SQL syntax errors
        (err as any).code ||
        err.name === 'QueryError' || // Knex query errors
        err.stack?.includes('knex')
      ) {
        // Any error from Knex stack

        logger.error(`Database error - ${err.message}`, { stack: err.stack });
        ResponseHandler.sendError(res, 'Internal server error', 500);
        return;
      }
      logger.error(`Global error - ${err}`);
      ResponseHandler.sendError(res, (err as any).message, (err as any).status || 500);
      return;
    });
  }

  /**
   * Responsible for initializing the database
   * and testing the database connection.
   * This also runs migrations if not in test environment.
   */
  private async initDatabase(): Promise<void> {
    try {
      logger.info('Initializing database connection...');

      this._database = Database.getInstance();
      await this._database.testConnection();

      // Run migrations
      // if (commonConfig.environment !== 'test') {
      //   logger.info('Running database migrations...');
      //   await this._database.runMigrations();
      // }

      logger.info('Database initialized successfully');
    } catch (error) {
      logger.error('Database initialization failed:', error);
      throw error;
    }
  }

  /**
   * Responsible for carrying out actions after
   * node process has exited. Closes database connection.
   */
  private setupGracefulShutdown(): void {
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully...`);

      try {
        // Close database connections
        if (this._database) {
          await this._database.close();
          logger.info('Database connections closed');
        }

        logger.info('Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  }

  /**
   * sets up swagger docs
   * @private
   */
  private setupSwagger() {
    const swaggerSpec = swaggerJSDoc(swaggerOptions);
    this._app.use('/api-docs', SwaggerUI.serve, SwaggerUI.setup(swaggerSpec));
  }

  // Return the express app instance
  public get app(): Express {
    return this._app;
  }

  // Return the database instance
  public get database(): Database {
    return this._database!;
  }
}
export default App;
