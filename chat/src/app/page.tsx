import NavBar from './NavBar/NavBar';
import SideBare from './SideBar/SideBare';
import ChatBody from './ChatBody/ChatBody';
export default function Home() {
  return (
    <>
      <NavBar />
      <div className='flex gap-4  h-5/6 px-4'>
        <SideBare />
        <ChatBody />
      </div>
    </>
  );
}

