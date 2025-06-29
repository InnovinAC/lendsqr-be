import config from "@/config/common.config";
import knex from "knex";

const knexConfig: knex.Knex.Config = {
    development: {
        client: 'mysql2',
        connection: {
            host: config.database.DATABASE_HOST,
            user: config.database.DATABASE_USERNAME,
            password: config.database.DATABASE_PASSWORD,
            database: config.database.DATABASE_NAME,
            port: config.database.DATABASE_PORT
        },
        migrations: {
            directory: './db/migrations'
        },
        seeds: {
            directory: './db/seeds'
        },
        // since only dev environment for my test
        logging: {
            warn: console.warn,
            error: console.error,
            debug: console.log
        }
    }
};

export default knexConfig;