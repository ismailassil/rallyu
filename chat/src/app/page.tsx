import NavBar from './NavBar/NavBar';
import SideBare from './SideBare/SideBare';
import ChatBody from './ChatBody/ChatBody';


export default function Home() {
  return (
    <main className="h-screen flex flex-col overflow-hidden p-4">
      <NavBar />

      <div className="flex gap-x-4  overflow-hidden">
        <SideBare />
        <ChatBody />
      </div>
    </main>
  );
}
