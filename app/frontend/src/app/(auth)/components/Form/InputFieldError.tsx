import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

type InputFieldErrorProps = {
	error: string;
};

export default function InputFieldError({ error } : InputFieldErrorProps) {
	if (!error) return null;
	return (
		<motion.div
			key='field-error'
			initial={{ opacity: 0, height: 0 }}
			animate={{ opacity: 1, height: "auto" }}
			exit={{ opacity: 0, height: 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
		>
			<div className={`text-red-400 font-light text-xs flex items-center p-1 gap-1.5`}>
				<AlertCircle size={14} className="shrink-0"/>
				<p>{error}</p>
			</div>
		</motion.div>
	);
}
