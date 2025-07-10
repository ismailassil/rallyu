import fastify from '../app';
import MessagesNotFoundException from '../shared/exceptions/MessagesNotFoundException';
import UserNotFoundException from '../shared/exceptions/UserNotFoundException';
import { MessageTypes, UserTypes } from '../shared/types/database.types';

class ChatRepository {
	getUserByUsername(username: string): UserTypes {
		const user = fastify.database
			.prepare(`SELECT * FROM users WHERE username = ?`)
			.get(username) as UserTypes;

		if (!user) throw new UserNotFoundException();

		return user;
	}

	getMessages(id: number, page: number): MessageTypes[] {
		const LIMIT = 10;
		const OFFSET = (page - 1) * LIMIT;

		const messages = fastify.database
			.prepare(
				`SELECT * FROM messages
				WHERE sender_id = ? OR receiver_id = ?
				ORDER BY sent_at DESC
				LIMIT ? OFFSET ?`,
			)
			.all(id, id, LIMIT, OFFSET) as MessageTypes[];

		if (!messages || messages.length === 0)
			throw new MessagesNotFoundException();

		return messages;
	}
}

export default ChatRepository;
