import { FastifyReply, FastifyRequest } from 'fastify';
import fastify from '../app';
import {
	ConversationType,
	QueryFetchChatsTypes,
} from '../shared/types/fetchChats.types';
import ChatServices from '../services/chat.services';
import UserNotFoundException from '../shared/exceptions/UserNotFoundException';
import MessagesNotFoundException from '../shared/exceptions/MessagesNotFoundException';
import { FullMessageDBResult } from '../shared/types/database.types';

class ChatControllers {
	private chatServices: ChatServices;

	constructor() {
		this.chatServices = new ChatServices();
	}

	getUserChatsHistory(req: FastifyRequest, res: FastifyReply) {
		const username: string = req.headers['x-user-username'] as string;
		const { with: withUsername, page } = req.query as QueryFetchChatsTypes;

		if (!username)
			return res.status(400).send({
				status: 'error',
				message: 'Error Occurred',
				details: 'x-user-username Empty',
			});

		let chats: FullMessageDBResult[];
		try {
			fastify.log.info(withUsername);
			if (!withUsername) {
				chats = this.chatServices.retrieveUserChatsData(username, page);
			} else {
				chats = this.chatServices.retrieveConversations(
					username,
					withUsername,
					page,
				);
			}

			const conversations: ConversationType[] =
				this.chatServices.parseChatsData(username, chats);

			return res.code(200).send({
				status: 'success',
				message: `Messages for ${username} was found`,
				data: conversations,
			});
		} catch (error) {
			if (error instanceof UserNotFoundException) {
				return res.code(500).send({
					status: 'error',
					message: `${username} Not Found`,
					error,
				});
			}
			if (error instanceof MessagesNotFoundException) {
				return res.code(500).send({
					status: 'error',
					message: `Messages for ${username} Not Found`,
					error,
				});
			}
			return res.code(500).send({
				status: 'error',
				message: 'INTERNAL_ERROR',
				error,
			});
		}
	}

	searchUsers(req: FastifyRequest, res: FastifyReply) {
		const username: string = req.headers['x-user-username'] as string;

		if (!username)
			return res.status(400).send({
				status: 'error',
				message: 'Error Occurred',
				details: 'x-user-username Empty',
			});
		try {
		} catch (error) {
			if (error instanceof UserNotFoundException) {
				return res.code(500).send({
					status: 'error',
					message: `${username} Not Found`,
					error,
				});
			}
			return res.code(500).send({
				status: 'error',
				message: 'INTERNAL_ERROR',
				error,
			});
		}
	}
}

export default ChatControllers;
