import { JSONCodec } from 'nats';
import UserService from '../User/UserService';

export async function handleUserRequests(msg: any, userService: UserService) {
	const jsonC = JSONCodec();
	const data = jsonC.decode(msg.data) as any;

	console.log(`[NATS] Received a message on [${msg.subject}] subject`);
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
		default:
			break ;
	}
	console.log(`[NATS] Replied to message on [${msg.subject}] subject`);
}
