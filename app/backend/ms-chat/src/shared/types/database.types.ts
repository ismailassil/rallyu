export interface UserTypes {
	id: number;
	username: string;
	first_name: string;
	last_name: string;
	image: Buffer;
}

export interface MessageTypes {
	id: number;
	sender_id: number;
	receiver_id: number;
	message: string;
	sent_at: string;
	delivered_at?: string | null;
	seen_at?: string | null;
	status: 'read' | 'unread';
}
