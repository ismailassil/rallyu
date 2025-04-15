import { motion } from "framer-motion";

function ResetButton({ resetValues }: { resetValues: () => void }) {
	return (
		<motion.button
			initial={{ opacity: 0, y: 10, scale: 0.9 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			whileHover={{ scale: 1.05, background: "rgba(36, 36, 36, 0.8)" }}
			whileTap={{ scale: 0.95 }}
			className="w-full h-11 px-2 border-2 border-white/20 rounded-sm transition-all duration-200 cursor-pointer"
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
