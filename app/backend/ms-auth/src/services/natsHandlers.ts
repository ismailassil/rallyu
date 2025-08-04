import { JSONCodec } from 'nats';
import UserService from './userService';
// import * as userService from './userService';

export async function handleUserRequests(msg: any) {
	const jsonC = JSONCodec();
	const data = jsonC.decode(msg.data) as any;

	const userService = new UserService();

	switch (msg.subject) {
		case 'user.username': {
			const username = await userService.getUsername(data.user_id);
			msg.respond(jsonC.encode({ username }));
			break ;
		}
		case 'user.avatar': {
			const avatar_path = await userService.getAvatar(data.user_id);
			msg.respond(jsonC.encode({ avatar_path }));
			break ;
		}
		default:
			break ;
	}
}
