import {Express, Router} from "express";
import commonConfig from "@/config/common.config";
import {allRoutes} from "@/routes";
import Database from "@/lib/database/database.lib";

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
    }

    private listen(port: string | number) {
        this._app.listen(port, () => {
            console.log(`Listening on port ${port}`);
        });
    }

    /**
     * Responsible for initializing all defined app routes
     * and ensuring they have the same router instance
     */
    private initRoutes() {
        const router = Router();
        this._app.use(commonConfig.server.baseApiUrl, router);
        allRoutes.forEach(route => {
            console.log("Initializing route", route.name);
            new route(router, this._database!.getConnection()).initRoutes()
        })
    }

    /**
     * Responsible for initializing the database
     * and testing the database connection.
     * This also runs migrations if not in test environment.
     */
    private async initDatabase(): Promise<void> {
        try {
            console.log('Initializing database connection...');

            this._database = Database.getInstance();
            await this._database.testConnection()


            // Run migrations
            if (commonConfig.environment !== 'test') {
                console.log('Running database migrations...');
                await this._database.runMigrations();
            }

            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Database initialization failed:', error);
            throw error;
        }
    }


    /**
     * Responsible for carrying out actions after
     * node process has exited. Closes database connection.
     */
    private setupGracefulShutdown(): void {
        const gracefulShutdown = async (signal: string) => {
            console.log(`Received ${signal}, shutting down gracefully...`);

            try {
                // Close database connections
                if (this._database) {
                    await this._database.close();
                    console.log('Database connections closed');
                }

                console.log('Graceful shutdown completed');
                process.exit(0);
            } catch (error) {
                console.error('Error during shutdown:', error);
                process.exit(1);
            }
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

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