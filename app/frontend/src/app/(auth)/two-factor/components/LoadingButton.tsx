import { Loader } from "lucide-react";

type LoadingButtonProps = {
	onClick: () => void;
	text: string;
	disabled: boolean;
	loading: boolean;
	loadingText: string;
};

export default function LoadingButton({
	onClick,
	text,
	disabled,
	loading,
	loadingText
} : LoadingButtonProps) {
	return (
		<button
			onClick={onClick}
			disabled={disabled || loading}
			className={`h-11 rounded-lg transition-all duration-500 ${
				disabled || loading
				? "bg-gray-500 cursor-not-allowed pointer-events-none"
				: "bg-blue-600 hover:bg-blue-700 cursor-pointer"
			}`}
		>
			{loading ? (
				<div className="flex justify-center items-center gap-2">
					<Loader className="w-4 h-4 animate-spin" />
					<span>{loadingText}</span>
				</div>
			) : (
				<span>{text}</span>
			)}
		</button>
	);
}
