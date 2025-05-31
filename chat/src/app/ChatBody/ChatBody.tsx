import UserMessage from "./components/UserMessage";
import Image from "next/image";

const ChatBody = () => {
  return (
    <div className="flex w-full  border border-gray-400 rounded-lg p-6 gap-4">
      <div className="flex flex-col w-5/12 h-full">

        <h2 className="text-4xl mb-8">Chat</h2>

        <div className="w-full flex gap-2 border rounded-full bg-white/15 p-2 mb-6">
          <Image width={24} height={24} src="/icons/user-search.svg" alt="search icon" />
          <input
            type="text"
            placeholder="Start Searching..."
            className="bg-transparent focus:outline-none placeholder-gray-300 w-full"
          />
        </div>
          <ul className="overflow-auto">
            <li><UserMessage /></li>
            <li><UserMessage /></li>
            <li><UserMessage /></li>
            <li><UserMessage /></li>
            <li><UserMessage /></li>
            <li><UserMessage /></li>
            <li><UserMessage /></li>
            <li><UserMessage /></li>
            <li><UserMessage /></li>
            <li><UserMessage /></li>
            <li><UserMessage /></li>
            <li><UserMessage /></li>
            <li><UserMessage /></li>
            <li><UserMessage /></li>
            <li><UserMessage /></li>
            <li><UserMessage /></li>
            <li><UserMessage /></li>
            <li><UserMessage /></li>
            <li><UserMessage /></li>
            <li><UserMessage /></li>
            <li><UserMessage /></li>
            <li><UserMessage /></li>
            <li><UserMessage /></li>
            <li><UserMessage /></li>
            <li><UserMessage /></li>
          </ul>
      </div>
      <div className=" w-11/12 border-2 border-white/15 rounded-lg flex flex-col justify-center items-center">
        <Image width={300} height={300} src={"/meme/thinking.gif"} alt="thiniking image" className="rounded-lg "/>
        <p className="text-lg mt-4">👋 Welcome to Chat!</p>
        <p className="text-gray-400">Select a user from the sidebar to start chatting.</p>
      </div>
    </div>
  );
};

export default ChatBody;
