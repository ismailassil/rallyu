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
			className="flex justify-between flex-col md:flex-row items-center gap-2 lg:gap-10 text-sm lg:text-base lg:min-h-11"
		>
			<label className="flex-1 w-full" htmlFor="picture">
				{label}
			</label>
			<div className="flex-3 w-full select-none">
				<div
					className="flex gap-2 border-2 border-white/10 min-h-11
						rounded-md py-1 px-3 items-center
						*:hover:scale-101 *:transform *:transition-all *:duration-200"
				>
					<input
						type="text"
						className="outline-none w-full rounded-sm"
						placeholder="Player Name"
						value={value}
						onChange={(e) => {
							e.preventDefault();
							setValue(e.target.value);
						}}
					/>
					{value && value.length !== 0 && (
						<Trash
							size={20}
							weight="light"
							className="cursor-pointer hover:fill-accent"
							onClick={(e) => {
								e.preventDefault();
								setValue("");
							}}
						/>
					)}
					<DiceFive
						size={20}
						weight="light"
						className="cursor-pointer hover:fill-accent"
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
