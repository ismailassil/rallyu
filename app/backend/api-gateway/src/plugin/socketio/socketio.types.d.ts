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

export interface MessageType {
	id: number;
	sender: string;
	receiver: string;
	message: string;
	sent_at: string;
	seen_at?: string | null;
	status: 'read' | 'unread';
}

interface IChatPayload {
	sender: string;
	receiver: string;
	message: MessageType;
}

interface ClientToServerEvents {
	// TODO: Remove, Use the socket.username which is retrieved from the JWT
	identify: (message: IMessage) => void;
	send_msg: (data: IChatPayload) => void;
}

interface ServerToClientEvents {
	update: (data: any) => void;
	notify: (data: any) => void;
}

interface socketioOpts {
	FRONT_PORT: string;
}
