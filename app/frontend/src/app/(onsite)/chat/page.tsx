"use client"
import SideBar from './components/SideBare/SideBare';
import Chat from './components/Chat/Chat';
import { SocketProvider } from './components/Chat/SocketContext';

const Page = () => {
  return (
    <SocketProvider>
        <Chat />
    </SocketProvider>
  );
};

export default Page;