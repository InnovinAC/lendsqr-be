import 'module-alias/register';
import express, {NextFunction, Request, Response} from 'express';
import cors from 'cors';
import App from "@/app";
import logger from "@/utils/logger.utils";
import ResponseHandler from "@/lib/api/response-handler.lib";

async function bootstrap() {
    try {
        const app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cors());
        new App(app).app;
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
}

bootstrap();