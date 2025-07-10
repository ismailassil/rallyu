import { FastifyReply, FastifyRequest } from 'fastify';
import { ParamsFetchChatsTypes } from '../shared/types/fetchChats.types';
import ChatServices from '../services/chat.services';
import UserNotFoundException from '../shared/exceptions/UserNotFoundException';
import MessagesNotFoundException from '../shared/exceptions/MessagesNotFoundException';

class ChatControllers {
	private chatServices: ChatServices;

	constructor() {
		this.chatServices = new ChatServices();
	}

	fetchChats(req: FastifyRequest, res: FastifyReply) {
		const { username } = req.params as ParamsFetchChatsTypes;

		try {
			const chats = this.chatServices.getUserChats(username);

			return res.code(200).send({
				status: 'success',
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
				error: error,
			});
		}
	}

	searchUsers() {}
}

export default ChatControllers;
