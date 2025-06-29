import {Knex} from 'knex';
// Knex cli is not aware of typescript paths "@"
import commonConfig from "./src/config/common.config";




const subConfig = {
    client: 'mysql2',
    connection: {
        host: commonConfig.database.DATABASE_HOST,
        user: commonConfig.database.DATABASE_USERNAME,
        password: commonConfig.database.DATABASE_PASSWORD,
        database: commonConfig.database.DATABASE_NAME,
        port: parseInt(commonConfig.database.DATABASE_PORT || '3306', 10),
    },
    migrations: {
        directory: './db/migrations',
    },
    seeds: {
        directory: './db/seeds',
    },
}
const config: {[key: string]: Knex.Config} = {
    development:
        {
            ...subConfig,
            log: {
                warn: (console.warn),
                error: (console.error),
                debug: (console.log),
            },
        },
    // Add test for jest
    test:
        {
            ...subConfig,
            connection: {
                ...subConfig.connection,
                database: commonConfig.database.TEST_DATABASE_NAME,
            },
            log: {
                warn: (console.warn),
                error: (console.error),
                debug: (console.log),
            },
        },
    production: {
        ...subConfig,
    },
};

export default config; 