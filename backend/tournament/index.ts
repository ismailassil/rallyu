import app from "./app";

(async () => {
    try {
        await app.listen({ port: 3008 });
        app.log.info(`Server listening on PORT: ${3008}`);
    } catch (err) {
        app.log.error("Server launch faild!" );
    }
})();

process.on('SIGTERM', async () => {
    await app.close()
    process.exit(0)
});

// Work this out!
process.on('SIGINT', async () => {
    await app.close()
    process.exit(0)
});