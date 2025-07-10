import { Fragment } from "react";
import Message from "./Message";
// import Image from "next/image";
import { useBox } from "../contexts/boxContext";
import MessageHeader from "./MessageHeader";
import WelcomeChat from "./WelcomeChat";
import MessageInput from "./MessageInput";

export default function MessageSection() {
	const { showbox, isWidth, userMessage } = useBox();

	return (
		<section
			className={`${
				isWidth && (showbox ? "block" : "hidden")
			} flex-5 bg-card border-br-card divide-white/15 divide-y-1 divide flex
						h-full w-full flex-col justify-between rounded-lg border-2`}
		>
			{userMessage ? (
				<>
					<MessageHeader />
					<div className="custom-scroll flex flex-1 flex-col-reverse gap-2 overflow-y-auto px-5 py-5">
						{Array.from({ length: 20 }).map((_, i) => (
							<Fragment key={i}>
								<Message
									username="Azouz Nabil"
									date="Tuesday, 12:21"
									message="Imta ghadi n9assro dik tournois? Imta ghadi n9assro dik tournois? Imta ghadi n9assro dik tournois? Imta ghadi n9assro dik tournois? Imta ghadi n9assro dik tournois? Imta ghadi n9assro dik tournois?"
								/>
								<Message
									username="Me"
									date="Tuesday, 13:21"
									message="Imta ghadi n9assro dik tournois? Imta ghadi n9assro dik tournois? Imta ghadi n9assro dik tournois? Imta ghadi n9assro dik tournois? Imta ghadi n9assro dik tournois? Imta ghadi n9assro dik tournois?"
								/>
							</Fragment>
						))}
					</div>
					<MessageInput />
				</>
			) : (
				<WelcomeChat />
			)}
		</section>
	);
}
