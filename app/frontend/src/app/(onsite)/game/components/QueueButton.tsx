import useMatchmaking from '@/app/hooks/useMatchMaking';
import { GameMode, GameType } from '../types/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const QueueToggleButton = ({ gameType, gameMode }: { gameType: GameType, gameMode: GameMode}) => {
	const { isSearching, queueTime, toggleSearch } = useMatchmaking(gameType);
	const router = useRouter();
	const [clicked, setClicked] =  useState(false);

	console.log('queuetime: ', queueTime)

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	const getButtonContent = () => {
		if (isSearching) return `Searching ${formatTime(queueTime)}`;
		else if (clicked)
			return ''
		return "Start Game";
	};

	const getButtonStyles = () => {
		const baseStyles = "w-full h-[70px] min-h-[30px] max-w-[1000px] min-w-0 mt-auto relative px-8 py-5 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] focus:outline-none shadow-lg";
		if (isSearching) {
			return `${baseStyles} bg-black/50 text-gray-200 text-sm border-2 border-gray-500/30  hover:bg-gray-600/10 cursor-pointer`;
		} else if (clicked) {
			return `${baseStyles} bg-black/50 text-gray-200 text-sm border-2 border-gray-500/30  hover:bg-gray-600/10 cursor-not-allowed`;

		}
		return `${baseStyles} bg-white/80 backdrop-blur-sm cursor-pointer text-black text-sm border-2 border-gray-400/50 hover:border-gray-300/70 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50`;
	};

	const joinMatch = () => {
		gameMode === 'local' && setClicked(!clicked);
		gameMode === 'remote'? toggleSearch() : router.push(`/game/${gameType}/local`);
	}

	return (
		<button
			onClick={joinMatch}
			className={`${getButtonStyles()}`}
		>
			{(isSearching || clicked) && (
				<div className="absolute inset-0 rounded-xl">
					<div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-gray-300/20 to-transparent opacity-15 animate-pulse"></div>
				</div>
			)}
			
			<span className="relative z-10 flex items-center justify-center space-x-2">
				{isSearching || clicked
					? <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>

					: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
					</svg>
				}
				<span className={`text-xl font-funnel-display`}>{getButtonContent()}</span>
			</span>
		</button>
	);
};

export default QueueToggleButton;