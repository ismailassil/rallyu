import fastify from '../app';
import ChatRepository from '../repositories/chat.repository';
import {
	MessageDBResult,
	MessageType,
	UserType,
} from '../shared/types/database.types';
import { ConversationType } from '../shared/types/fetchChats.types';

class ChatServices {
	private chatRepository: ChatRepository;
	constructor() {
		this.chatRepository = new ChatRepository();
	}

	retrieveUserChatsData(username: string, page: number): MessageDBResult[] {
		const user = this.chatRepository.getUserByUsername(username);

		const messages = this.chatRepository.getMessages(user.id, page);

		return messages;
	}

	parseChatsData(username: string, chats: MessageDBResult[]): ConversationType[] {
		const uniqueConversations = new Map();

		chats.forEach((chat) => {
			let user;
			let conversation;
			if (chat.receiver_username !== username) {
				user = {
					id: chat.receiver_id,
					username: chat.receiver_username,
					first_name: chat.receiver_first_name,
					last_name: chat.receiver_last_name,
					image: chat.receiver_image,
				};
				conversation = {
					id: chat.message_id,
					sender: chat.sender_username,
					receiver: chat.receiver_username,
					message: chat.message,
					sent_at: chat.sent_at,
					seen_at: chat.seen_at,
					status: chat.status,
				};
			} else {
				user = {
					id: chat.sender_id,
					username: chat.sender_username,
					first_name: chat.sender_first_name,
					last_name: chat.sender_last_name,
					image: chat.sender_image,
				};
				conversation = {
					id: chat.message_id,
					sender: chat.sender_username,
					receiver: chat.receiver_username,
					message: chat.message,
					sent_at: chat.sent_at,
					seen_at: chat.seen_at,
					status: chat.status,
				};
			}

			if (!uniqueConversations.has(user.id)) {
				uniqueConversations.set(user.id, { user, messages: [conversation] });
			} else {
				uniqueConversations.get(user.id).messages.push(conversation);
			}
		});

		return Array.from(uniqueConversations.values());
	}
}

export default ChatServices;
