import useMatchmaking from "@/app/hooks/useMatchMaking";

const X = () => {
    const { queueTime, isSearching, found, toggleSearch } = useMatchmaking('tictactoe');

    const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

    return (
        <div
            className="absolute inset-0 rounded-xl transition-all duration-150 hover:bg-gray-300/[6%] bg-card hover:scale-[101%] active:scale-[99%] cursor-pointer [clip-path:polygon(0_0,55%_0,45%_100%,0_100%)]"
            style={{
                fontFamily: 'Serious2b'
            }}
            onClick={toggleSearch}
        >
            <span className={`text-4xl ${found && 'animate-pulse'} uppercase`}>
                {isSearching ? `in queue ${formatTime(queueTime)}` : found ? 'Match Found' : 'Remote Play'}
            </span>
		</div>
    )
}

export default X;