import LeaderboardItem from './LeaderBoardItem';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import MainCardWithHeader from '../../(refactoredUIComponents)/MainCardWithHeader';

export default function LeaderboardCard() {
	const [leaderboard, setLeaderboard] = useState([]);
	const { apiClient } = useAuth();

	useEffect(() => {
		async function fetchLeaderboard() {
			try {
				const data = await apiClient.fetchLeaderboard();
				setLeaderboard(data);
			} catch (err) {
				console.log(err);
			}
		}

		fetchLeaderboard();
	}, []);

	if (leaderboard.length === 0)
		return <h1>Loading...</h1>;

	return (
		<MainCardWithHeader headerName='Leaderboard' className='font-funnel-display flex-3'>
			{/* Leaderboard */}
			<div className="group flex flex-col gap-3 px-6">
				{leaderboard.map((item, i) => (
					<LeaderboardItem
						position={i}
						key={i}
						img={item.avatar_url}
						username={item.username}
						rank={item.rank}
						score={item.total_xp}
					/>
				))}
			</div>
		</MainCardWithHeader>
	);
}
