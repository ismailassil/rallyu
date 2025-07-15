export interface UserType {
	id: number;
	username: string;
	first_name: string;
	last_name: string;
	image: Buffer;
}

export interface MessageType {
	id: number;
	sender: string;
	receiver: string;
	message: string;
	sent_at: string;
	delivered_at?: string | null;
	seen_at?: string | null;
	status: 'read' | 'unread';
}

export interface MessageDBResult {
	message_id: number;
	message: string;
	sent_at: string;
	delivered_at?: string | null;
	seen_at?: string | null;
	status: 'read' | 'unread';
	sender_id: number;
	sender_username: string;
	sender_first_name: string;
	sender_last_name: string;
	sender_image: Buffer;
	receiver_id: number;
	receiver_username: string;
	receiver_first_name: string;
	receiver_last_name: string;
	receiver_image: Buffer;
}
