import app from "./app.js";

(async () => {
    try {
        await app.listen({ port: 3001 });
        app.log.info(`Server listening on PORT: ${3001}`);
    } catch (err) {
        app.log.error("Server launch faild!" );
    }
})()