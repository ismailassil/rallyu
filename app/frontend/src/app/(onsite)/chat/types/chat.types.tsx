export type LoggedUser = {
	avatar_url: string,
	first_name: string,
	last_name: string,
	id: number,
	username: string,
	last_message : MessageType
	email: string,
	bio: string,
};

export type MessageType = {
	senderId: number;
	receiverId: number;
	text: string;
	created_at: string;
}