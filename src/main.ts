import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import App from "@/app";
import logger from "@/utils/logger.utils";

async function bootstrap() {
    try {
        const app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cors());
        new App(app);
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
}

bootstrap();