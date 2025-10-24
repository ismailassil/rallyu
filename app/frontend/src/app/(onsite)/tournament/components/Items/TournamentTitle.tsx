import { Trash } from "@phosphor-icons/react";
import { motion } from "framer-motion";

function TournamentTitle({ value, setValue, error, setError }) {
	return (
		<>
			<motion.div
				initial={{ opacity: 0, x: -100 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.2, delay: 0.1 }}
				className="lg:min-h-11 flex flex-col items-center justify-between gap-2
					text-sm md:flex-row lg:gap-20 lg:text-base"
			>
				<label className="w-full flex-1" htmlFor="title">
					Tournament Title
				</label>
				<div className="flex-2 w-full select-none">
					{error && (
						<p className="mb-1 text-red-500">
							Tournament title length must be between 2 - 15 characters.
						</p>
					)}
					<div
						className={`min-h-11 *:hover:scale-101 *:transform *:transition-all *:duration-200
									flex items-center gap-2 rounded-md border-2 px-3 py-1
									${error ? "border-red-700" : "border-white/10"}`}
					>
						<input
							id="title"
							type="text"
							className="w-full rounded-sm outline-none"
							placeholder="Summer Party"
							value={value}
							onChange={(e) => {
								e.preventDefault();
								setValue(e.target.value);
								setError(false);
							}}
							maxLength={15}
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
					</div>
				</div>
			</motion.div>
		</>
	);
}

export default TournamentTitle;
