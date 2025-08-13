import app from "./app.js";

(async () => {
    try {
        await app.listen({ port: 5025 });
        app.log.info(`Server listening on PORT: ${5025}`);
    } catch (err) {
        app.log.error("Server launch faild!" );
    }
})();