import funnelDisplay from '@/app/fonts/FunnelDisplay';
import ChartPie from '../components/Charts/ChartPie';
import { ChartCard, StatCard, StatDetailedCard } from '../components/Cards';
import { Trophy } from 'lucide-react';

const gameTypeDistData = [
	{ type: "Ping Pong", percent: 56 },
	{ type: "Tic Tac Toe", percent: 100 - 56 },
];

const gameModeDistData = [
	{ type: "Casual", percent: 22 },
	{ type: "1v1", percent: 33 },
	{ type: "Tournaments", percent: 24 },
	{ type: "Training", percent: 100 - 24 - 22 - 33 },
];

// const gamesPerDayData = [
// 	{ date: "2023-01-01", games: 5 },
// 	{ date: "2023-01-02", games: 9 },
// 	{ date: "2023-01-03", games: 10 },
// 	{ date: "2023-01-03", games: 1 },
// 	{ date: "2023-01-04", games: 16 },
// 	{ date: "2023-01-05", games: 6 },
// 	{ date: "2023-01-06", games: 11 },
// ];

const gameSessionData = [
    { id: 1, opponent: 'ProGamer2024', result: 'Win', duration: '12:34', score: '15-8', mode: 'Ranked 1v1', date: '2024-07-06 15:30' },
    { id: 2, opponent: 'ShadowPlayer', result: 'Loss', duration: '8:45', score: '7-15', mode: 'Ranked 1v1', date: '2024-07-06 14:15' },
    { id: 3, opponent: 'QuickShot99', result: 'Win', duration: '6:22', score: '15-3', mode: 'Casual', date: '2024-07-06 13:45' },
    { id: 4, opponent: 'MasterChief', result: 'Draw', duration: '15:18', score: '15-12', mode: 'Ranked 1v1', date: '2024-07-06 12:30' },
    { id: 5, opponent: 'NightHawk', result: 'Loss', duration: '9:57', score: '10-15', mode: 'Tournament', date: '2024-07-06 11:15' }
];

// type StatItem = {
// 	label: string;
// 	value: string | number;
// 	valueClass?: string;
// };
  
// type StatCardProps = {
// 	title: string;
// 	items: StatItem[];
// };
  
// const StatsCard: React.FC<StatCardProps> = ({ title, items }) => (
// 	<div className="bg-white/4 border border-white/10 w-full rounded-2xl backdrop-blur-2xl px-4 py-3 overflow-hidden flex-2">
// 		<h1 className="font-bold text-xl mb-4">{title}</h1>
// 		<div className="flex flex-col gap-1">
// 			{items.map((item, idx) => (
// 			<div key={idx} className="flex justify-between">
// 				<p className="font-medium text-lg text-white/70">{item.label}</p>
// 				<p className={`font-extrabold text-xl ${item.valueClass ?? "text-white/90"}`}>
// 				{item.value}
// 				</p>
// 			</div>
// 			))}
// 		</div>
// 	</div>
// );

// function ChartCard({ title, subtitle, chart } : { title: string, subtitle: string, chart: React.ReactNode }) {
// 	return (
// 		<div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md p-4 flex flex-col h-full overflow-hidden">
// 			<h2 className="font-bold text-lg">{title}</h2>
// 			<p className="text-sm text-violet-400 mb-4">{subtitle}</p>
// 			<div className="flex-1 overflow-hidden">{chart}</div>
// 		</div>
// 	);
// }

function GamesHistoryTable() {
	return (
		<div className="bg-white/4 border border-white/10  w-full rounded-2xl backdrop-blur-2xl overflow-auto">
			<div className='flex items-center justify-between px-4 py-3 mb-4'>
								<div>
									<p className='font-bold text-xl'>Recent Games</p>
									<p className='text-sm text-violet-400'>Detailed history of your latest matches</p>
								</div>
								<div>Filters</div>
							</div>
							<table className="min-w-full divide-y divide-gray-200">
								<thead>
									<tr>
										<th className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider">
											Opponent
										</th>
										<th className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider">
											Type
										</th>
										<th className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider">
											Mode
										</th>
										<th className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider">
											Result
										</th>
										<th className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider">
											Score
										</th>
										<th className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider">
											Duration
										</th>
										<th className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider">
											Date
										</th>
									</tr>
								</thead>
								<tbody className="divide-y">
									{gameSessionData.map((session) => (
										<tr key={session.id} className="hover:bg-white/6">
											<td className="px-6 py-3 text-center text-sm font-medium text-white tracking-wider">
												{session.opponent}
											</td>
											<td className="px-6 py-3 text-center text-sm font-medium text-white tracking-wider">
												XO
											</td>
											<td className="px-6 py-3 text-center text-sm font-medium text-white tracking-wider">
												{session.mode}
											</td>
											<td className="px-6 py-3 text-center text-sm font-medium text-white tracking-wider">
												<span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full border ${
													session.result === 'Win' 
														? 'border-green-500 text-green-500' :
													session.result === 'Loss'
														? 'border-red-500 text-red-500'
														: 'border-gray-500 text-gray-500'
													}`}>
													{session.result}
												</span>
											</td>
											<td className="px-6 py-3 text-center text-sm font-medium text-white tracking-wider">
												{session.score}
											</td>
											<td className="px-6 py-3 text-center text-sm font-medium text-white tracking-wider">
												{session.duration}
											</td>
											<td className="px-6 py-3 text-center text-sm font-medium text-white tracking-wider">
												{session.date}
											</td>
										</tr>
									))}

								</tbody>
							</table>
		</div>
	);
}

export default function GameSessionsDashboardV2() {
	return (
		<main className="pt-30 sm:pl-30 h-[100vh] pb-24 pl-6 pr-6 sm:pb-6">
			<div className="bg-white/4 border border-white/10 h-full w-full rounded-2xl backdrop-blur-2xl">
			<header className="relative shrink-0 overflow-hidden">
				<h1
				className={`${funnelDisplay.className} font-bold py-10 px-13 select-none text-4xl capitalize relative left-0 hover:left-4 transition-all duration-500`}
				>
					Game Sessions
				</h1>
				<div className="w-18 h-5 absolute left-0 top-[51%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0E0E0] transition-all duration-200 group-hover:scale-105" />
			</header>

			<section className="hide-scrollbar mb-4 max-h-[calc(100vh-19rem)] flex-1 overflow-y-auto h-full">
				<div className={`px-8 flex h-full flex-col gap-4 ${funnelDisplay.className}`}>

					<section className='grid gap-4 lg:grid-cols-2 2xl:grid-cols-4'>
							<StatCard
								title="Today's Games"
								value="6"
								subtitle="3 wins / 2 losses"
								subtitleColor="text-green-500"
								icon={<Trophy size={20} />}
							/>
							<StatCard
								title="Avg Session Time"
								value="11:42"
								subtitle="minutes per game"
								subtitleColor="text-blue-500"
								icon={<Trophy size={20} />}
							/>
							<StatCard
								title="Highest Score Today"
								value="15"
								subtitle="vs iassil"
								subtitleColor="text-green-500"
								icon={<Trophy size={20} />}
							/>
							<StatCard
								title="Opponents Faced"
								value="5"
								subtitle="unique players"
								subtitleColor="text-blue-500"
								icon={<Trophy size={20} />}
							/>
					</section>

					<section className='grid gap-4 xl:grid-cols-2 min-h-160 xl:min-h-80'>
						<ChartCard 
							title='Game Type Distribution'
							subtitle='Ping Pong vs XO over all time'
							chart={<ChartPie data={gameTypeDistData} nameKey='type' dataKey='percent' unit='%' />}
						/>
						<ChartCard 
							title='Game Mode Distribution'
							subtitle='Casual vs 1v1 vs Tournament vs Training over all time'
							chart={<ChartPie data={gameModeDistData} nameKey='type' dataKey='percent' unit='%' />}
						/>
					</section>

					<section className=''>
						<GamesHistoryTable />
					</section>

					<section className='grid gap-4 lg:grid-cols-3'>
						<StatDetailedCard
							title="Match Outcomes"
							items={[
								{ label: "Wins", value: 56, valueClass: "text-green-400" },
								{ label: "Losses", value: 22, valueClass: "text-red-400" },
								{ label: "Win Rate", value: "73.6%" }
							]}
						/>

						<StatDetailedCard
							title="Score Analysis"
							items={[
								{ label: "Highest Score", value: 56, valueClass: "text-yellow-400" },
								{ label: "Average Score", value: 22 },
								{ label: "Lowest Score", value: 2, valueClass: "text-white/60" }
							]}
						/>

						<StatDetailedCard
							title="Session Stats"
							items={[
								{ label: "Longest Session", value: "15:12", valueClass: "text-blue-400" },
								{ label: "Shortest Session", value: "6:33" },
								{ label: "Total Playtime", value: "2h 14m", valueClass: "text-violet-400" }
							]}
						/>
					</section>

				</div>
			</section>
			</div>
		</main>
	);
}