import { JsMsg } from 'nats';
import { app as fastify } from '../app.js';
import { ChatPayload } from '../types/chat.types.js';

function handleChatMsg(m: JsMsg) {
	fastify.log.info(m.subject);
	const { data } = m;
	const payload = fastify.jsCodec.decode(data) as ChatPayload;

	const senderRoom = payload?.senderId?.toString();
	const receivedRoom = payload?.receiverId?.toString();

	if (m.subject.includes('send_msg')) {
		fastify.log.info('====== send_msg');
		fastify.io.to(senderRoom).emit('chat_update_msg', payload);
	} else if (m.subject.includes('update_msg')) {
		fastify.log.info('====== update_msg');
		fastify.io.to(receivedRoom).emit('chat_receive_msg', payload);
	}

	/***
	 * When the User sends a message to a friend and has multiple sessions opened,
	 * send it to all sessions!
	 */
}

export default handleChatMsg;
