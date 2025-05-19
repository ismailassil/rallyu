import app from "./app.js";

(async () => {
    try {
        await app.listen({ port: 3000 });
        app.log.info(`Server listening on PORT: ${3000}`);
    } catch (err) {
        app.log.error("Server launch failed!" );
    }
})()