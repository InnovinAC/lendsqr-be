"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_config_1 = __importDefault(require("@/config/common.config"));
const knexConfig = {
    development: {
        client: 'mysql2',
        connection: {
            host: common_config_1.default.database.DATABASE_HOST,
            user: common_config_1.default.database.DATABASE_USERNAME,
            password: common_config_1.default.database.DATABASE_PASSWORD,
            database: common_config_1.default.database.DATABASE_NAME,
            port: common_config_1.default.database.DATABASE_PORT
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
exports.default = knexConfig;
