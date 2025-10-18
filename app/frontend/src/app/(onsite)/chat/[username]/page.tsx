import Chat from '../components/Chat';
import { ChatProvider } from '../context/ChatContext';

const Page = async ({ params }: { params: { username: string }}) => {
	return (
		<ChatProvider>
			<Chat username={params?.username}/>
		</ChatProvider>
	);
};

export default Page;
