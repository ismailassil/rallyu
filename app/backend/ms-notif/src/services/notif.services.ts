import NotifRepository from '../repositories/notif.repository.js';
import INotifyBody from '../shared/types/notifyBody.types';

class NotifSerives {
	notifRepository: NotifRepository;

	constructor() {
		this.notifRepository = new NotifRepository();
	}

	async registerNotification(body: INotifyBody) {
		const { from_user, to_user, msg, type, action_url } = body;

		// Register the Notification Senders

		let from_id = await this.notifRepository.checkUser(from_user);
		if (from_id === null) from_id = await this.notifRepository.registerUser(from_user);

		let to_id = await this.notifRepository.checkUser(to_user);
		if (to_id === null) to_id = await this.notifRepository.registerUser(to_user);

		/// Register the Notification Message
		this.notifRepository.registerMessage(from_id, to_id, type, msg, action_url);
	}
}

export default NotifSerives;
