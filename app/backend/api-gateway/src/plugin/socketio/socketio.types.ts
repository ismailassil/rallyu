import 'fastify';
import { Server } from 'socket.io';
import { ChatPayload, MessageType } from '../../types/chat.types.js';
import {
	UPDATE_NOTIFICATION_DATA,
	USER_NOTIFICATION,
} from '../../types/notification.types.js';

declare module 'fastify' {
	export interface FastifyInstance {
		io: Server<ClientToServerEvents, ServerToClientEvents>;
		connectedUsers: Map<string, Set<string>>;
	}
}

interface ClientToServerEvents {
	chat_send_msg: (data: MessageType) => void;
	notification_update: (data: UPDATE_NOTIFICATION_DATA) => void;
}

interface ServerToClientEvents {
	notification_update: (data: UPDATE_NOTIFICATION_DATA) => void;
	notification_notify: (data: USER_NOTIFICATION) => void;
	chat_receive_msg: (data: ChatPayload) => void;
	chat_update_msg: (data: ChatPayload) => void;
}

export interface socketioOpts {
	FRONT_PORT: string;
}
