import dotenv from 'dotenv';

dotenv.config({quiet: true});
const config = Object.freeze({
    database: {
        DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
        DATABASE_PORT: process.env.DATABASE_PORT || '3306',
        DATABASE_USERNAME: process.env.DATABASE_USERNAME || 'root',
        DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || '',
        DATABASE_NAME: process.env.DATABASE_NAME || 'lendsqr-be',
        TEST_DATABASE_NAME: process.env.TEST_DATABASE_NAME || 'lendsqr-be-test',
    },
    environment: process.env.NODE_ENV || 'development',
    server: {
        port: process.env.PORT || 3000,
        baseApiUrl: '/api/v1'
    }
})

export default config;