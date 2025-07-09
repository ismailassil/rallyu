import React from "react";
import FilledButton from "./FilledButton";
import OutlineButton from "./OutlineButton";
import { X } from "@phosphor-icons/react";

const GameNotification = ({ isValid }: { isValid: boolean }) => {
	return (
		<>
			{!isValid && (
				<div className="ml-10 flex gap-2">
					<FilledButton>Join Game</FilledButton>
					<OutlineButton>
						<X size={16} />
					</OutlineButton>
				</div>
			)}
		</>
	);
};

export default GameNotification;
