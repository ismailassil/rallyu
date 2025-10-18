import {
	ArrowBendUpRightIcon,
	ArrowLeftIcon,
	ChatCenteredDotsIcon,
	PaperPlaneRightIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from "@/app/(onsite)/contexts/AuthContext";

interface Props {
	state: boolean;
	message: string;
	username: string;
	receiverId: number;
	handler: () => void;
}

// TODO | after read and certain time, return the state to `finished`
const Chat = ({ state, receiverId, message, username, handler }: Props) => {
	const [showInput, setShowInput] = useState(false);
	const [text, setText] = useState("");
	const router = useRouter();
	const { socket, loggedInUser } = useAuth();

	function sendMessage() {
		if (state) return;
		if (!text.trim()) return;

		const newMessage = {
			id: Date.now(),
			senderId: loggedInUser?.id,
			receiverId: receiverId,
			text: text.toString().substring(0, 50),
		};
		socket.emit("chat_send_msg", newMessage);
		setShowInput(false);
		setText("");
		handler();
	}

	return (
		<div className="flex size-full items-center gap-2">
			{!state && (
				<div
					className="bg-card cursor-pointer rounded-lg p-2 ring-1 ring-white/10 transition-all duration-300 hover:scale-101 hover:bg-white/10"
					onClick={() => !state && setShowInput((prev) => !prev)}
				>
					<AnimatePresence mode="wait">
						{showInput ? (
							<motion.div
								key="arrow-left"
								initial={{ opacity: 0, scale: 0 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0 }}
								transition={{
									duration: 0.2,
									ease: "easeOut",
								}}
							>
								<ArrowLeftIcon size={16} className="fill-white/80" />
							</motion.div>
						) : (
							<motion.div
								key="chat-dots"
								initial={{ opacity: 0, scale: 0 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0 }}
								transition={{
									duration: 0.2,
									ease: "easeOut",
								}}
							>
								<ChatCenteredDotsIcon size={16} className="fill-white/80" />
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			)}
			<div
				className={`bg-card focus-within:ring-main flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-4 py-2 text-xs ring-1 transition-all duration-300 ease-in-out hover:scale-101 hover:bg-white/10 ${showInput ? "ring-white/15" : "ring-br-card"}`}
			>
				<AnimatePresence mode="wait">
					{showInput ? (
						<>
							<motion.input
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -10 }}
								transition={{ duration: 0.2 }}
								type="text"
								maxLength={50}
								className="w-[85%] outline-none"
								value={text}
								placeholder="Start typing"
								onChange={(e) => {
									e.preventDefault();
									setText(e.target.value);
								}}
								onKeyDown={(e) => e.key === "Enter" && sendMessage()}
							/>
							<motion.div
								key="send"
								initial={{ opacity: 0, scale: 0 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0 }}
								transition={{
									duration: 0.2,
									ease: "easeOut",
								}}
							>
								<PaperPlaneRightIcon
									size={18}
									onClick={() => sendMessage()}
									className="transition-transform duration-200 hover:scale-110"
								/>
							</motion.div>
						</>
					) : (
						<>
							<motion.p
								className="line-clamp-1 flex-1"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 20 }}
								transition={{ duration: 0.2 }}
							>
								{message}
							</motion.p>
							<motion.div
								key="redirect"
								initial={{ opacity: 0, scale: 0 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0 }}
								transition={{
									duration: 0.2,
									ease: "easeOut",
								}}
							>
								<ArrowBendUpRightIcon
									size={18}
									onClick={() => router.push(`/chat/${username}`)}
								/>
							</motion.div>
						</>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default Chat;
