export type LoggedUser = {
	avatar_path: string,
	first_name: string,
	last_name: string,
	id: number,
	relation_status: string,
	username: string,
	last_message : MessageType
};


export type MessageType = {
	senderId: number;
	receiverId: number;
	text: string;
	created_at: string;
	isSeen: boolean
}