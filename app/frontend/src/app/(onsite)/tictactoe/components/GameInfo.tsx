import Timer from './Timer';
import PlayerCard from './PlayerCard';
import ScoreBox from './ScoreBox';
import RoundDisplay from './RoundDisplay';
import { useXO } from '../contexts/xoContext';

function GameInfo() {
	const { timeLeft, score, round, currentPlayer: pl } = useXO();

	return (
		<>
			<div className="min-h-20 flex max-h-20 select-none items-center justify-between gap-10 px-2">
				<PlayerCard current={pl === 'pl1' ? true : false} />
				<ScoreBox score={score.pl1} />
				<Timer secondsLeft={timeLeft} />
				<ScoreBox score={score.pl2} />
				<PlayerCard align="right" current={pl === 'pl2' ? true : false} />
			</div>
			<RoundDisplay round={round} />
		</>
	);
}

export default GameInfo;
