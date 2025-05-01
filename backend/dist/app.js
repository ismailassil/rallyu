import fastify from 'fastify';
const app = fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
            },
        },
    },
});
export { app };
