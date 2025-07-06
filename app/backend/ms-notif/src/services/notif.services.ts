import INotifMessage from '../shared/types/notifMessage.types.js';
import NotifRepository from '../repositories/notif.repository.js';
import INotifyBody from '../shared/types/notifyBody.types.js';
import fastify from '../app.js';
import IUpdateBody from '../shared/types/update.types.js';
import { IFetchResponse } from '../shared/types/fetch.types.js';
import { UserNotFoundException } from '../shared/exceptions/UserNotFoundException.js';

class NotifSerives {
	private notifRepository: NotifRepository;

	constructor() {
		this.notifRepository = new NotifRepository();
	}

	async registerNotification(body: INotifyBody): Promise<number> {
		const { from_user, to_user } = body;

		// Register the Notification Senders
		let from_id = await this.notifRepository.checkUser(from_user);
		if (from_id === null) {
			// TODO: Request the user's image
			from_id = await this.notifRepository.registerUser(from_user);
		}

		let to_id = await this.notifRepository.checkUser(to_user);
		if (to_id === null) {
			// TODO: Request the user's image
			to_id = await this.notifRepository.registerUser(to_user);
		}

		// Register the Notification Message
		const fullData: INotifMessage = await this.notifRepository.registerMessage(
			from_id,
			to_id,
			body,
		);

		const data = {
			id: fullData.id,
			from_user: fullData.from_user,
			to_user: fullData.to_user,
			message: fullData.message,
			type: fullData.type,
			created_at: fullData.created_at,
			updated_at: fullData.updated_at,
			status: fullData.status,
			action_url: fullData.action_url,
		};

		// Store it in Redis
		await fastify.redis.set(`notif?id=${data.id}`, JSON.stringify(data));

		return data.id;
	}

	async getUserMessages(username: string, page: number): Promise<INotifMessage[]> {
		let user_id = await this.notifRepository.checkUser(username);
		if (user_id === null) throw new UserNotFoundException();

		const data: INotifMessage[] = await this.notifRepository.getMessages(
			user_id,
			page,
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
		if (user_id === null) throw new UserNotFoundException();

		await (all
			? this.notifRepository.updateAllNotif(status, user_id)
			: this.notifRepository.updateNotif(status, user_id, notificationId));
	}

	unpackMessage(fullData: INotifMessage[]): IFetchResponse[] {
		return fullData.map(
			({
				id,
				from_user,
				to_user,
				message,
				type,
				created_at,
				updated_at,
				status,
				action_url,
			}) => ({
				id,
				from_user,
				to_user,
				message,
				type,
				created_at,
				updated_at,
				status,
				action_url,
			}),
		);
	}
}

export default NotifSerives;
