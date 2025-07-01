import 'fastify';
import { Server } from 'socket.io';

declare module 'fastify' {
	export interface FastifyInstance {
		io: Server<ClientToServerEvents, ServerToClientEvents>;
	}
}

interface ServerToClientEvents {
	message: (text: string) => void;
}

interface ClientToServerEvents {
	reply: (text: string) => void;
}
