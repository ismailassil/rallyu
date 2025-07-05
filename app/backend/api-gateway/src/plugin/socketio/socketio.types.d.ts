import 'fastify';
import { Server } from 'socket.io';

declare module 'fastify' {
	export interface FastifyInstance {
		io: Server<ClientToServerEvents, ServerToClientEvents>;
		connectedUsers: Map<string, Set<string>>;
	}
}

interface IMessage {
	username: string;
}

interface ClientToServerEvents {
	identify: (message: IMessage) => void;
}

interface ServerToClientEvents {
	update: (data: any) => void;
	notify: (data: any) => void;
}
