import React from "react";

const OutlineButton = ({ children }: { children: React.ReactNode }) => {
	return (
		<p
			className="flex cursor-pointer items-center justify-center rounded-lg px-3
					text-sm ring-1 ring-white/40 transition-all duration-300
					hover:scale-105 hover:bg-white/10"
		>
			{children}
		</p>
	);
};

export default OutlineButton;
