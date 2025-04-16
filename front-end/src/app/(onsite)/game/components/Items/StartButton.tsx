import geistSans from "@/app/fonts/geistSans";

function StartButton({ setStart }: { setStart: (value: boolean) => void }) {
	return (
		<button
			className={`${geistSans.className} min-h-11 lg:h-13 lg:min-h-13 bg-main hover:scale-101 hover:text-main hover:ring-3 h-11
						w-full flex-1 cursor-pointer rounded-md text-base
						font-semibold uppercase ring-white/20 transition-all duration-300 hover:bg-white lg:text-lg
					`}
			onClick={(e) => {
				e.preventDefault();
				setStart(true);
			}}
		>
			Start The Game
		</button>
	);
}

export default StartButton;
