import { Hash, PingPong } from "@phosphor-icons/react";
import { useState } from "react";

function Filter() {
	const [filter, setFilter] = useState(0);

	return (
		<div
			className="border-1 min-w-30 min-h-10 *:cursor-pointer *:hover:bg-white *:hover:text-black
				*:transition-all *:duration-300 *:flex-1 *:flex *:items-center *:w-full
				*:h-full *:p-1 *:rounded-sm group
				relative flex max-h-10 
				items-center justify-center gap-1 rounded-lg border-white/20 bg-white/5 p-1.5 text-sm"
		>
			<PingPong
				size={10}
				className={filter === 1 ? "bg-white text-black" : ""}
				onClick={(e) => {
					e.preventDefault();
					if (filter === 1) {
						setFilter(0);
					} else {
						setFilter(1);
					}
				}}
			/>
			<Hash
				size={10}
				className={filter === 2 ? "bg-white text-black" : ""}
				onClick={(e) => {
					e.preventDefault();
					if (filter === 2) {
						setFilter(0);
					} else {
						setFilter(2);
					}
				}}
			/>
		</div>
	);
}

export default Filter;
