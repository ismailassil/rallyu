import app from "./app.js";

(async () => {
    try {
        await app.listen({ port: 5020 });
        app.log.info(`Server listening on PORT: ${5020}`);
    } catch (err) {
        app.log.error("Server launch faild!" );
    }
})();