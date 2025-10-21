import Chat from '../components/Chat';
import { ChatProvider } from '../context/ChatContext';

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;

  return (
    <ChatProvider>
      <Chat username={username} />
    </ChatProvider>
  );
};

export default Page;
