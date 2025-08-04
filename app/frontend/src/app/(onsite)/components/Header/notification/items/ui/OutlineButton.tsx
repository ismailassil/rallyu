import React from "react";

const OutlineButton = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => {
	return (
		<button
			className="flex cursor-pointer items-center justify-center rounded-lg px-3
					text-sm ring-1 ring-white/40 transition-all duration-300
					hover:scale-105 hover:bg-white/10"
			onClick={onClick}
		>
			{children}
		</button>
	);
};

export default OutlineButton;
