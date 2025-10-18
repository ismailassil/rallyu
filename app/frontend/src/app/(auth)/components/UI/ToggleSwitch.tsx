import React from "react";

interface ToggleSwitchProps {
	enabled: boolean;
	isLocked?: boolean;
	onToggle: () => void;
}

export default function ToggleSwitch({
	enabled = false,
	isLocked = false,
	onToggle
} : ToggleSwitchProps) {

	return (
		<button
			type="button"
			disabled={isLocked}
			onClick={onToggle}
			className={`relative inline-flex h-7.5 w-16 items-center rounded-full transition-all duration-500 ml-auto border border-white/8 ease-in-out cursor-pointer
				${enabled ? "bg-blue-600/80" : "bg-white/4"}
				${isLocked ? "opacity-50" : ""}`}
		>
			<span
				className={`inline-block h-5 w-[30px] transform rounded-full bg-white/80 transition-all duration-500 ease-in-out
				${enabled ? "translate-x-[27px]" : "translate-x-[5px]"}
				flex items-center justify-center`}
			></span>
		</button>
	);
}
