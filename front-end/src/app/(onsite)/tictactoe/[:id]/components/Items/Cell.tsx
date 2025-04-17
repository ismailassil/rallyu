import { Circle, X } from "@phosphor-icons/react";
import { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";

type cellProps = {
	id: number;
	go: string;
	setGo: Dispatch<SetStateAction<string>>;
	cells: string[];
	setCells: Dispatch<SetStateAction<string[]>>;
	cell: string;
	isWon: boolean;
};

function Cell({ go, setGo, id, cells, setCells, cell, isWon }: cellProps) {
	const handleClick = () => {
		if (isWon || !!cells[id]) return;
		if (go === "cross") {
			handleCellChange("cross");
			setGo("circle");
		} else {
			handleCellChange("circle");
			setGo("cross");
		}
	};

	function handleCellChange(value: string) {
		const updatedCells = [...cells];
		updatedCells[id] = value;
		setCells(updatedCells);
	}

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.5 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ type: "spring", stiffness: 160, damping: 10 }}
			className={`hover:scale-104 translate-all cursor-pointer}
				flex items-center cursor-pointer
				justify-center rounded-md bg-white/4 duration-500
			`}
			onClick={handleClick}
		>
			{cell ? (
				cell === "circle" ? (
					<motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
						<Circle weight="bold" size={120} />
					</motion.div>
				) : (
					<motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
						<X weight="bold" size={120} />
					</motion.div>
				)
			) : (
				""
			)}
		</motion.div>
	);
}

export default Cell;
