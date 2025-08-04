import React from "react";

const FilledButton = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => {
	return (
		<button
			className="hover:bg-main-hover bg-main cursor-pointer rounded-lg px-4 py-0.5
			text-sm transition-all duration-300  hover:scale-105"
			onClick={onClick}
		>
			{children}
		</button>
	);
};

export default FilledButton;
