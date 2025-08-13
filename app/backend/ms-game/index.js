const Fastify = require('fastify')
const path = require('path')
const fastifyStatic = require('@fastify/static')
const { game } = require('./plugins/queue')
const fastify = Fastify({
	logger: {
		level: 'info',
		transport: {
			target: 'pino-pretty',
			options: {
				ignore: 'pid,hostname',
				colorize: true
			}
		}
	}
})

fastify.register(fastifyStatic, { root: path.join(__dirname, 'dist') })
fastify.register(require('@fastify/websocket'))
fastify.register(require('@fastify/jwt'), { 
	secret: process.env.ROOM_ACCESS || "4CC3SS_R00M_"
});
fastify.register(game, { prefix: '/game'})

fastify.listen({ port: 5010, host: '0.0.0.0' }, (err) => {
	if (err) {
		console.log(err)
		process.exit(1)
	}
})

// // Client → Server:
// { type: "join" }
// { type: "paddle", pid: 0, y: 120 }

// // Server → Client:
// { type: "start", index: 0 or 1 }
// { type: "state", state: { ball: ..., paddles: [...] } }
// { type: "waiting" }