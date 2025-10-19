import "fastify";
import { Server } from "socket.io";
import type { ChatPayload, MessageType } from "../../types/chat.types.js";
declare module "fastify" {
	export interface FastifyInstance {
		io: Server<ClientToServerEvents, ServerToClientEvents>;
		connectedUsers: Map<string, Set<string>>;
	}
}

interface ClientToServerEvents {
	// Chat
	chat_send_msg: (data: MessageType) => void;
	// Notification
	notification: (data: any) => void;
}

interface ServerToClientEvents {
	// Chat
	chat_receive_msg: (data: ChatPayload) => void;
	chat_update_msg: (data: ChatPayload) => void;
	// Notification
	notification: (data: any) => void;
	// User
	user: (data: any) => void;
}

export interface socketioOpts {
	FRONT_PORT: string;
}
