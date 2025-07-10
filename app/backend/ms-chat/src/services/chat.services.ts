import ChatRepository from '../repositories/chat.repository';

class ChatServices {
	private chatRepository: ChatRepository;
	constructor() {
		this.chatRepository = new ChatRepository();
	}

	getUserChats(username: string) {
		const user = this.chatRepository.getUserByUsername(username);

		
	}
}

export default ChatServices;
