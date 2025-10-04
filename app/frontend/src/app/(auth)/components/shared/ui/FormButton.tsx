import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

type FormButtonProps = {
	text: string;
	icon?: ReactNode;
	disabled?: boolean;
	isSubmitting?: boolean;
	submittingText?: string;
	submittingIcon?: ReactNode;
	onClick?: () => void;
	type?: "button" | "submit" | "reset";
	className?: string;
};

export default function FormButton({
	text,
	icon,
	disabled = false,
	isSubmitting = false,
	submittingText,
	submittingIcon = <Loader2 className="animate-spin" size={16} />,
	onClick,
	type = "submit",
	className = "",
}: FormButtonProps) {
	const isDisabled = disabled || isSubmitting;

	const currentText = (isSubmitting && submittingText) ? submittingText : text;
	const currentIcon = isSubmitting ? submittingIcon : icon;

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={isDisabled}
			className={
				`flex items-center justify-center gap-2 px-4 py-[10px] rounded-[10px] font-medium shadow-sm transition-colors duration-500 ` +
				(isDisabled
					? "bg-gray-600 text-gray-300 cursor-not-allowed pointer-events-none"
					: "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer") +
				(className ? ` ${className}` : "")}
		>
			{currentIcon && <span>{currentIcon}</span>}
			<span>{currentText}</span>
		</button>
	);
}
