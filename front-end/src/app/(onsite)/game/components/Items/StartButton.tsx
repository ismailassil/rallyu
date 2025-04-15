import geistSans from "@/app/fonts/geistSans";

function StartButton({ setStart }: { setStart: (value: boolean) => void }) {
	return (
		<button
			className={`${geistSans.className} w-full h-11 min-h-11 lg:h-13 lg:min-h-13 text-base lg:text-lg flex-1
						font-semibold bg-main rounded-md uppercase cursor-pointer
						hover:scale-101 transition-all duration-300 hover:bg-white hover:text-main hover:ring-3 ring-white/20
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
