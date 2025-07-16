import { FastifyReply, FastifyRequest } from 'fastify';
import {
	ConversationType,
	ParamsFetchChatsTypes,
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

	getUserChats(req: FastifyRequest, res: FastifyReply) {
		const { username } = req.params as ParamsFetchChatsTypes;
		const { page } = req.query as QueryFetchChatsTypes;

		try {
			const chats: FullMessageDBResult[] =
				this.chatServices.retrieveUserChatsData(username, page);

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

	searchUsers() {}
}

export default ChatControllers;
