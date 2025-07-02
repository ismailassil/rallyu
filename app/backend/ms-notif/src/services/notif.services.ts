import INotifMessage from '../shared/types/notifMessage.types.js';
import NotifRepository from '../repositories/notif.repository.js';
import INotifyBody from '../shared/types/notifyBody.types';
import fastify from '../app.js';
import IUpdateBody from '../shared/types/update.types.js';
import { emitType } from '../shared/types/socketio.types.js';

class NotifSerives {
	private notifRepository: NotifRepository;

	constructor() {
		this.notifRepository = new NotifRepository();
	}

	async registerNotification(body: INotifyBody): Promise<number> {
		const { from_user, to_user } = body;

		// Register the Notification Senders
		let from_id = await this.notifRepository.checkUser(from_user);
		if (from_id === null)
			from_id = await this.notifRepository.registerUser(from_user);

		let to_id = await this.notifRepository.checkUser(to_user);
		if (to_id === null) to_id = await this.notifRepository.registerUser(to_user);

		// Register the Notification Message
		return await this.notifRepository.registerMessage(from_id, to_id, body);
	}

	getSocketId(to_user: string): string[] {
		let userSocketId: string[] = [];
		for (let [key, value] of fastify.connectedUsers.entries()) {
			if (value === to_user) userSocketId.push(key);
		}

		return userSocketId;
	}

	async getUserMessages(
		username: string,
		limit: number,
		offset: number,
	): Promise<INotifMessage[]> {
		let user_id = await this.notifRepository.checkUser(username);
		if (user_id === null) throw Error('User Not Found');

		const data: INotifMessage[] = await this.notifRepository.getMessages(
			user_id,
			limit,
			offset,
		);

		return data;
	}

	async updateNotification({
		username,
		notificationId,
		status,
		all,
	}: IUpdateBody) {
		let user_id = await this.notifRepository.checkUser(username);
		if (user_id === null) throw Error('User Not Found');

		await (all
			? this.notifRepository.updateAllNotif(status, user_id)
			: this.notifRepository.updateNotif(status, user_id, notificationId));
	}

	broadcastMessage(emit: emitType, userSocketId: string[], ...resData: [any]) {
		if (userSocketId.length !== 0) {
			userSocketId.forEach((id) =>
				fastify.io.sockets.to(id).emit(emit, ...resData),
			);
			fastify.log.info('✅ Notification sent via Socket.IO');
		} else {
			fastify.log.warn('🧩 User Not Connected');
		}
	}
}

export default NotifSerives;
