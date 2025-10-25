import useMatchmaking from '@/app/hooks/useMatchMaking';

const QueueToggleButton = () => {
	const { isSearching, queueTime, toggleSearch } = useMatchmaking('pingpong');

	console.log('queuetime: ', queueTime)

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	const getButtonContent = () => {
		if (!isSearching) return "Start Game";
		else return `In Queue... ${formatTime(queueTime)}`;
	};

	const getButtonStyles = () => {
		const baseStyles = "w-full max-w-[1000px] min-w-0 mt-auto cursor-pointer relative px-8 py-5 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] focus:outline-none w-80 shadow-lg";
		if (isSearching) {
				return `${baseStyles} bg-black/50 text-gray-200 text-sm border-2 border-gray-500/30  hover:bg-gray-600/10`;
		}
		return `${baseStyles} bg-white/80 backdrop-blur-sm text-black text-sm border-2 border-gray-400/50 hover:border-gray-300/70 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50`;
	};

	return (
		<button
			onClick={toggleSearch}
			className={`${getButtonStyles()}`}
		>
			{isSearching && (
				<div className="absolute inset-0 rounded-xl">
					<div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-gray-300/20 to-transparent opacity-15 animate-pulse"></div>
				</div>
			)}
			
			<span className="relative z-10 flex items-center justify-center space-x-2">
				{isSearching
					? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>

					: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
					</svg>
				}
				<span className={`text-xl font-funnel-display`}>{getButtonContent()}</span>
			</span>
		</button>
	);
};

export default QueueToggleButton;