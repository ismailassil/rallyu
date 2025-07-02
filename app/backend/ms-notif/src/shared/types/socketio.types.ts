import 'fastify';
import { Server } from 'socket.io';
import { IMessage } from './notifMessage.types';

declare module 'fastify' {
	export interface FastifyInstance {
		io: Server<ClientToServerEvents, ServerToClientEvents>;
		connectedUsers: Map<string, string>;
	}
}

type emitType = 'notification' | 'update' | 'message';

export { emitType };

interface ServerToClientEvents {
	notification: (text: string) => void;
	message: (text: string) => void;
	update:
		| ((notificationId: number, status: 'read' | 'dismissed') => void)
		| ((all: boolean, status: 'read' | 'dismissed') => void);
}

interface ClientToServerEvents {
	reply: (text: string) => void;
	identify: (message: IMessage) => void;
}
