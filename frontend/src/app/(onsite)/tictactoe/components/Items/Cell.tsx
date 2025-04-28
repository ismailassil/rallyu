import { Circle, X } from "@phosphor-icons/react";
import { Dispatch, SetStateAction, useMemo } from "react";
import { motion } from "framer-motion";
import { useXO } from "../../contexts/xoContext";
import { useTicTacToe } from "@/app/(onsite)/contexts/tictactoeContext";

type cellProps = {
	id: number;
	go: string;
	setGo: Dispatch<SetStateAction<string>>;
	cells: string[];
	setCells: Dispatch<SetStateAction<string[]>>;
	cell: string;
	disabled: boolean;
};

function Cell({ go, setGo, id, cells, setCells, cell, disabled }: cellProps) {
	const { setStart } = useXO();
	const { xColor, oColor } = useTicTacToe();

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

	const xColour = useMemo(() => xColor.replace("bg-", "text-"), [xColor]);
	const oColour = useMemo(() => oColor.replace("bg-", "text-"), [oColor]);

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
					<motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
						<Circle weight="bold" size={120} className={oColour} />
					</motion.div>
				) : (
					<motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
						<X weight="bold" size={120} className={xColour} />
					</motion.div>
				)
			) : (
				""
			)}
		</motion.div>
	);
}

export default Cell;
