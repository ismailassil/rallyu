import { X } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function PushNotification({
	onClose,
	setPopup,
	label,
	show,
}: {
	onClose: (value: boolean) => void;
	setPopup: (value: number) => void;
	label: string;
	show: boolean;
}) {
	const [progress, setProgress] = useState(100);
	const divRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!show) return;
		const duration = 7000;
		const start = Date.now();
		const interval = setInterval(() => {
			const elapsed = Date.now() - start;
			const percentage = Math.max(0, 100 - (elapsed / duration) * 100);
			setProgress(percentage);
			if (elapsed >= duration) {
				clearInterval(interval);
				onClose(false);
				setPopup(-1);
			}
		}, 100);

		function handleClick(e: MouseEvent) {
			if (divRef.current && !divRef.current.contains(e.target as Node)) {
				onClose(false);
				setPopup(-1);
			}
		}

		document.addEventListener("mousedown", handleClick);
		return () => {
			document.removeEventListener("mousedown", handleClick);
			clearInterval(interval);
		};
	}, [show, onClose, setPopup]);

	return (
		<AnimatePresence mode="wait">
			{show && (
				<motion.div
					ref={divRef}
					key="notice"
					initial={{ opacity: 0, y: -20, scale: 0.8 }}
					animate={{
						opacity: 1,
						y: 0,
						scale: 1,
						transition: {
							type: "spring",
							duration: 0.6,
							bounce: 0.5,
						},
					}}
					exit={{
						opacity: 0,
						y: -30,
						scale: 0.7,
						rotate: -5,
						transition: {
							type: "spring",
							duration: 0.5,
							bounce: 0.2,
							stiffness: 120,
							damping: 10,
						},
					}}
					className="max-w-80 min-w-80 z-201 bg-white/9
					ring-white/15 rounded-xs divide-y-1
					divide-white/11 absolute left-1/2 top-5 flex -translate-x-1/2
					flex-col overflow-hidden text-sm ring-2 backdrop-blur-xl
					"
				>
					<div
						className="linear bg-main h-0.5 transition-all"
						style={{ width: `${progress}%` }}
					></div>
					<div className="flex justify-between gap-3 p-2">
						<div className="flex-1">{label}</div>
						<X
							size={20}
							className="cursor-pointer text-gray-500"
							onClick={(e) => {
								e.preventDefault();
								onClose(false);
								setPopup(-1);
							}}
						/>
					</div>
					<div className="*:w-full divide divide-x-1 divide-white/11 *:text-center *:cursor-pointer flex w-full">
						<p
							className="rounded-bl-xs hover:bg-main pb-1 pt-1"
							onClick={(e) => {
								e.preventDefault();
								onClose(true);
								setPopup(-1);
							}}
						>
							Yes
						</p>
						<p
							className="rounded-br-xs pb-1 pt-1 hover:bg-red-500"
							onClick={(e) => {
								e.preventDefault();
								onClose(false);
								setPopup(-1);
							}}
						>
							No
						</p>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default PushNotification;
