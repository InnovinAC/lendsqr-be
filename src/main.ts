async function bootstrap() {
    try {
        console.log("Innovin has started the engine");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

bootstrap();