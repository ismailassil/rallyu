import app from "./app";

const port = Number(process.env.TOURNAMENT_PORT) || 5006;

(async () => {
    try {
        await app.listen({ port });
        app.log.info(`Server listening on PORT: ${port}`);
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