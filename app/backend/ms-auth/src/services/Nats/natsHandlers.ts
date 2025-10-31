import { JSONCodec } from 'nats';
import UserService from '../User/UserService';
import RelationsService from '../User/RelationsService';
import logger from '../../utils/misc/logger';

export async function handleUserRequests(msg: any, userService: UserService, relationsService: RelationsService) {
	const jsonC = JSONCodec();
	const data = jsonC.decode(msg.data) as any;

	logger.info(`[NATS] Received a message on [${msg.subject}] subject`);
	switch (msg.subject) {
		case 'user.username': {
			const targetUser = await userService.getUserById(data.user_id);
			msg.respond(jsonC.encode({ username: targetUser ? targetUser.username : null }));
			break ;
		}
		case 'user.avatar': {
			const targetUser = await userService.getUserById(data.user_id);
			msg.respond(jsonC.encode({ avatar_url: targetUser ? targetUser.avatar_url : null }));
			break ;
		}
		case 'user.friends': {
			const targetUserFriends = await relationsService.getFriends(data.user_id);
			msg.respond(jsonC.encode({ friends: targetUserFriends }));
			break ;
		}
		default:
			break ;
	}
	logger.info(`[NATS] Replied to message on [${msg.subject}] subject`);
}
