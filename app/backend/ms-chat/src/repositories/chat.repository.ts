import fastify from '../app';
import MessagesNotFoundException from '../shared/exceptions/MessagesNotFoundException';
import UserNotFoundException from '../shared/exceptions/UserNotFoundException';
import {
	FullMessageDBResult,
	MessageType,
	UserType,
} from '../shared/types/database.types';
import { IChatPayload, IMessagePayload } from '../shared/types/nats.types';

class ChatRepository {
	getUserByUsername(username: string): UserType {
		const user = fastify.database
			.prepare(`SELECT * FROM users WHERE username = ?`)
			.get(username) as UserType;

		if (!user) throw new UserNotFoundException();

		return user;
	}

	getMessages(id: number, page: number): FullMessageDBResult[] {
		const LIMIT = 10;
		const OFFSET = (page - 1) * LIMIT;

		const messages = fastify.database
			.prepare(
				`
					SELECT m.id AS message_id,
							m.message,
							m.sent_at,
							m.seen_at,
							m.status,
					
							sender.id as sender_id,
							sender.username as sender_username,
							sender.first_name as sender_first_name,
							sender.last_name as sender_last_name,
							sender.image as sender_image,
							
							receiver.id as receiver_id,
							receiver.username as receiver_username,
							receiver.first_name as receiver_first_name,
							receiver.last_name as receiver_last_name,
							receiver.image as receiver_image

					FROM messages AS m
			
					JOIN users sender ON sender.id = m.sender_id
					JOIN users receiver ON receiver.id = m.receiver_id
			
					WHERE sender.id = ? OR receiver_id = ?
					ORDER BY sent_at DESC
					LIMIT ? OFFSET ?;
				`,
			)
			.all(id, id, LIMIT, OFFSET) as FullMessageDBResult[];

		if (!messages || messages.length === 0)
			throw new MessagesNotFoundException();

		return messages;
	}

	saveMessage(
		senderId: number,
		receiverId: number,
		payload: IMessagePayload,
	): MessageType {
		const messageInfo = fastify.database
			.prepare(
				`INSERT INTO messages (sender_id, receiver_id, message, sent_at) VALUES(?, ?) RETURNING *`,
			)
			.get(
				senderId,
				receiverId,
				payload.message,
				payload.sent_at,
			) as MessageType;

		return messageInfo;
	}
}

export default ChatRepository;
