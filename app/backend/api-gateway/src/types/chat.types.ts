export interface MessageType {
	senderId: number;
	receiverId: number;
	text: string;
}

export interface ChatPayload {
	id: number;
	senderId: number;
	receiverId: number;
	text: string;
	created_at: Date;
}

