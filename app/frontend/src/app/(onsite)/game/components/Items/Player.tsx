import { DiceFive, Trash } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import random from "../Utils/random";

function Player({
	label,
	value,
	setValue,
}: {
	label: string;
	value: string;
	setValue: (value: string) => void;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, x: -100 }}
			animate={{ opacity: 1, x: 0 }}
			className="lg:min-h-11 flex flex-col items-center justify-between gap-2 text-sm md:flex-row lg:gap-10 lg:text-base"
		>
			<label className="w-full flex-1" htmlFor="picture">
				{label}
			</label>
			<div className="flex-3 w-full select-none">
				<div
					className="min-h-11 *:hover:scale-101 *:transform *:transition-all *:duration-200
						flex items-center gap-2 rounded-md
						border-2 border-white/10 px-3 py-1"
				>
					<input
						type="text"
						className="w-full rounded-sm outline-none"
						placeholder="Player Name"
						value={value}
						maxLength={15}
						onChange={(e) => {
							e.preventDefault();
							setValue(e.target.value);
						}}
					/>
					{value && value.length !== 0 && (
						<Trash
							size={20}
							weight="light"
							className="hover:fill-accent cursor-pointer"
							onClick={(e) => {
								e.preventDefault();
								setValue("");
							}}
						/>
					)}
					<DiceFive
						size={20}
						weight="light"
						className="hover:fill-accent cursor-pointer"
						onClick={(e) => {
							e.preventDefault();
							setValue(random("Player"));
						}}
					/>
				</div>
			</div>
		</motion.div>
	);
}

export default Player;
