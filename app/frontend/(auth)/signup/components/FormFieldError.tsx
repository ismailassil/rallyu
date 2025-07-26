import { AlertCircle } from "lucide-react";
import SlideInOut from "./SlideInOut";

type FormFieldErrorProps = {
	error: string;
};

export default function FormFieldError({ error } : FormFieldErrorProps) {
	return (
		<SlideInOut>
			<div className={`text-red-400 font-light text-xs flex items-center p-1 gap-1.5`}>
				<AlertCircle size={14} className="shrink-0"/>
				<p>{error}</p>
			</div>
		</SlideInOut>
	);
}
