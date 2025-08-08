import Chat from './components/Chat';
import { ChatProvider } from './context/ChatContext';

const Page = () => {

	return (
		<ChatProvider>
			<Chat />
		</ChatProvider>
	);
};

export default Page;