import React from "react";

const FilledButton = ({ children }: { children: React.ReactNode }) => {
	return (
		<p
			className="hover:bg-main-hover bg-main cursor-pointer rounded-lg px-4 py-0.5
			text-sm transition-all duration-300  hover:scale-105"
		>
			{children}
		</p>
	);
};

export default FilledButton;
