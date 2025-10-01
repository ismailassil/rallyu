import { JSONCodec } from 'nats';
import UserService from '../User/UserService';
import UserRepository from '../../repositories/deprecated/userRepository';
import RelationsService from '../User/RelationsService';
// import * as userService from './userService';

export async function handleUserRequests(msg: any, userService: UserService) {
	const jsonC = JSONCodec();
	const data = jsonC.decode(msg.data) as any;

	switch (msg.subject) {
		case 'user.username': {
			const { username } = await userService.getUserById(data.user_id);
			msg.respond(jsonC.encode({ username }));
			break ;
		}
		case 'user.avatar': {
			const { avatar_url } = await userService.getUserById(data.user_id);
			msg.respond(jsonC.encode({ avatar_url }));
			break ;
		}
		default:
			break ;
	}
	console.log(`[NATS] Received a message on [${msg.subject}] subject`);
}
