import { Circle, X } from "@phosphor-icons/react";
import { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { useXO } from "../../contexts/xoContext";

type cellProps = {
	id: number;
	go: string;
	setGo: Dispatch<SetStateAction<string>>;
	cells: string[];
	setCells: Dispatch<SetStateAction<string[]>>;
	cell: string;
	disabled: boolean;
	xColor: string;
	oColor: string;
};

function Cell({ go, setGo, id, cells, setCells, cell, xColor, oColor, disabled }: cellProps) {
	const { setStart } = useXO();

	const handleClick = () => {
		if (disabled || !!cells[id]) return;
		if (go === "cross") {
			handleCellChange("cross");
			setGo("circle");
		} else {
			handleCellChange("circle");
			setGo("cross");
		}
		setStart(15);
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
			className={`hover:scale-104 translate-all
				bg-white/4 flex
				items-center justify-center rounded-md duration-500
				${disabled ? "select-none" : "cursor-pointer"}
			`}
			onClick={handleClick}
		>
			{cell ? (
				cell === "circle" ? (
					<motion.div
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
					>
						<Circle weight="bold" size={120} className={`${xColor}`} />
					</motion.div>
				) : (
					<motion.div
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
					>
						<X weight="bold" size={120} className={`${oColor}`} />
					</motion.div>
				)
			) : (
				""
			)}
		</motion.div>
	);
}

export default Cell;
