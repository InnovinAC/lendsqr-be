import commonConfig from '../../config/common.config';
import knexConfig from '../../../knexfile';
import { type Knex, knex } from 'knex';
import logger from '@/utils/logger.utils';

// Singleton pattern
class Database {
  static instance: Database;
  private readonly db: Knex;
  private isConnected: boolean = false;

  constructor() {
    const config = knexConfig[commonConfig.environment];
    this.db = knex(config);
  }

  /**
   * Used to get a universal instance of the Database class
   * @returns Database
   **/
  public static getInstance() {
    if (!Database.instance) {
      logger.info('creating database instance');
      Database.instance = new Database();
    }
    return Database.instance;
  }

  /**
   * Get db connection
   * @returns Knex
   */
  public getConnection(): Knex {
    return this.db;
  }

  // Test database connection
  public async testConnection(): Promise<void> {
    try {
      await this.db.raw('SELECT 1');
      this.isConnected = true;
    } catch (error: any) {
      this.isConnected = false;
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }

  // Run migrations
  public async runMigrations(): Promise<void> {
    try {
      await this.db.migrate.latest();
    } catch (error: any) {
      throw new Error(`Database migration failed: ${error.message}`);
    }
  }

  /**
   * Check if db is healthy
   * @returns Promise<void>
   */
  public isHealthy(): boolean {
    return this.isConnected;
  }

  /**
   * Closes db connection
   * @returns Promise<void>
   */
  public async close(): Promise<void> {
    try {
      await this.db.destroy();
      this.isConnected = false;
      logger.info('Database connection closed');
    } catch (error) {
      logger.error('Error closing database connection:', error);
      throw error;
    }
  }
}
export default Database;
