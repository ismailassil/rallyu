import unicaOne from '@/app/fonts/unicaOne';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const MOCK_ANALYTICS = {
	totals: {
	  matches: 12,
	  wins: 8,
	  losses: 4,
	  draws: 0,
	  win_rate: 66.67,
	},
	scores: {
	  total_user_score: 166,
	  max_user_score: 21,
	  min_user_score: 2,
	  avg_user_score: 13.83,
	  avg_user_win_score: 14.13,
	  avg_user_loss_score: 13.25,
	  avg_user_draw_score: 0,
	  total_opp_score: 135,
	  max_opp_score: 21,
	  min_opp_score: 0,
	  avg_opp_score: 11.25,
	  avg_opp_win_score: 8.63,
	  avg_opp_loss_score: 16.5,
	  avg_opp_draw_score: 0,
	},
	durations: {
	  total_duration: 10980,
	  max_duration: 3000,
	  min_duration: 120,
	  avg_duration: 915,
	  avg_user_win_duration: 915,
	  avg_user_loss_duration: 915,
	  avg_user_draw_duration: 0,
	},
};

const LABELS = {
	matches: "Games Played",
	wins: "Games Won",
	losses: "Games Lost",
	draws: "Games Drawn",
	win_rate: "Win Rate (%)",
  
	total_user_score: "Total Score",
	max_user_score: "Highest Score",
	min_user_score: "Lowest Score",
	avg_user_score: "Average Score",
  
	total_duration: "Total Playtime",
	max_duration: "Longest Game",
	min_duration: "Shortest Game",
  };

  function formatLabel(key) {
	return LABELS[key] || key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  }

function flatten(obj: any) {
	const res = [];
	for (const section in obj) {
	  for (const key in obj[section]) {
		res.push({ label: key, value: obj[section][key] });
	  }
	}
	return res;
  }
  

const ProfileSnapshot = () => {
	const stats = flatten(MOCK_ANALYTICS);
  	const [index, setIndex] = useState(0);

		useEffect(() => {
			const id = setInterval(() => {
			setIndex(() => Math.floor(Math.random() * stats.length));
			}, 2000); // change every 2s
			return () => clearInterval(id);
		}, [stats.length]);

		const stat = stats[index];

	return (
		<aside
			className={`bg-card border-br-card h-full w-full flex-3 rounded-lg border-2`}
		>
			<div className="group relative shrink-0 overflow-hidden">
				<h1
					className={`${unicaOne.className} px-11 py-9 select-none text-4xl uppercase`}
				>
					Snapshots
				</h1>
				<div
					className="w-15 h-15 bg-accent
					absolute -left-4 top-[calc(50%)] -translate-x-1/2 -translate-y-1/2 rounded-lg
					transition-all duration-200 group-hover:scale-105"
				/>
			</div>
			<div
      className="bg-white/4 border border-white/10 hover:scale-101 flex flex-1
        flex-col items-center justify-center overflow-hidden rounded-2xl p-5 py-2 transition-all backdrop-blur-xl
        duration-200 sm:flex-row sm:justify-between hover:bg-white/6 mb-12"
    >
      <AnimatePresence mode='popLayout'>
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.4 }}
          className="flex w-full justify-between items-center"
        >
          <p className="text-lg text-white/60 font-bold sm:text-xl sm:text-start">
            {formatLabel(stat.label)}
          </p>
          <p className="text-3xl text-white/80 font-bold">{stat.value}</p>
        </motion.div>
      </AnimatePresence>
    </div>
								<div
									className="bg-white/4 border border-white/10 hover:scale-101 flex flex-1
											flex-col items-center justify-center overflow-auto rounded-2xl p-5 py-2 transition-all backdrop-blur-xl
											duration-200
											sm:flex-row sm:justify-between hover:bg-white/6
										"
								>
									<p className="text-lg text-white/60 font-bold sm:text-xl sm:text-start">
										Games
										<span className="inline lg:hidden"> </span>
										<span className="hidden sm:inline"><br /></span>
										Played
									</p>
									<p className="text-3xl text-white/80 font-bold">
										13
									</p>
								</div>
								<div
									className="bg-white/4 border border-white/10 hover:scale-101 flex flex-1
										flex-col items-center justify-center overflow-auto rounded-2xl p-5 py-2 transition-all backdrop-blur-xl
										duration-200
										sm:flex-row sm:justify-between hover:bg-white/6
									"
								>
									<p className="text-lg text-white/60 font-bold sm:text-xl sm:text-start">
										Longest
										<span className="inline lg:hidden"> </span>
										<span className="hidden sm:inline"><br /></span>
										Streak
									</p>
									<p className="text-3xl text-white/80 font-bold">
										5
									</p>
								</div>
			<div>LATEST MATCH</div>
			<div>1 RANDOM STAT -NUMERIC-</div>
			<div>1 RANDOM STAT -OPPONENT-</div>
			<div>RANDOM GRAPH</div>
		</aside>
	);
};

export default ProfileSnapshot;
