import { ArrowRight, Plus } from "@phosphor-icons/react";

function StartButton({
	setValue,
	label = "Start a Tournament",
}: {
	setValue: (value: boolean) => void;
	label?: string;
}) {
	const isArena = label.includes("Arena");
	return (
		<button
			className={`bg-main min-w-45 min-h-10 "hover:scale-102"
				group relative flex max-h-10
				cursor-pointer items-center justify-center
				gap-3 overflow-hidden rounded-lg text-sm
				transition-all duration-300
				`}
			onClick={(e) => {
				e.preventDefault();
				setValue(true);
			}}
		>
			{!isArena ? (
				<Plus
					size={16}
					weight="bold"
					className={`absolute translate-x-[-50%] opacity-0
					transition-all duration-300
					group-hover:translate-x-0 group-hover:opacity-100
					`}
					style={{
						left: "50%",
						top: "50%",
						transform: "translate(-50%, -50%)",
					}}
				/>
			) : (
				<ArrowRight
					size={16}
					weight="bold"
					className={`absolute translate-x-[-50%] opacity-0
					transition-all duration-300
					group-hover:translate-x-0 group-hover:opacity-100
					`}
					style={{
						left: "50%",
						top: "50%",
						transform: "translate(-50%, -50%)",
					}}
				/>
			)}
			<p
				className={`transition-all duration-200
					group-hover:translate-x-[-50%] group-hover:opacity-0
					`}
			>
				{label}
			</p>
		</button>
	);
}

export default StartButton;
