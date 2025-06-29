import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import App from "@/app";

async function bootstrap() {
    try {
        const app = express();
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(cors());
        new App(app);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

bootstrap();