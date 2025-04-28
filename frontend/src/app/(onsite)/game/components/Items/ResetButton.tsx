import { motion } from "framer-motion";

function ResetButton({ resetValues }: { resetValues: () => void }) {
	return (
		<motion.button
			initial={{ opacity: 0, y: 10, scale: 0.9 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			whileHover={{ scale: 1.05, background: "rgba(36, 36, 36, 0.8)" }}
			whileTap={{ scale: 0.95 }}
			className="h-11 w-full cursor-pointer rounded-sm border-2 border-white/20 px-2 transition-all duration-200"
			onClick={(e) => {
				e.preventDefault();
				resetValues();
			}}
		>
			Reset to Default
		</motion.button>
	);
}

export default ResetButton;
