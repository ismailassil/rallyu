import React from 'react';

/*
	ALL GAMES
		- TOP CARDS
			- TOTAL GAMES
			- WIN RATE
			- AVERAGE SCORE
			- CURRENT STREAK
		- REST
			- PERFORMANCE OVER TIME (WIN RATE + AVG SCORE - CHART)
			- GAME TYPE DISTRIBUTION (1v1 | TOURNAMENT | TRAINING)
			- GAME TYPE DISTRIBUTION (PING PONG | TIC TAC TOE)
			- DAILY ACTIVITY (GAMES PER DAY)
			X- PLAYTIME ANALYSIS (TOTAL PLAYTIME | AVERAGE SESSION | ...)
*/

/*
	- SELECTOR (ALL | PING PONG | TIC TAC TOE)
	- TOP CARDS
		- TODAYS GAMES
		- AVG SESSION TIME
		- BEST SCORE TODAY
		- UNIQUE OPPONENTS FACED
	- RECENT GAME SESSIONS
	- BOTTOW CARDS
		- MATCHES OUTCOMES
		- SCORE ANALYSIS
		- SESSION STATS
*/

export default function UserStats() {
	return (
		<>
			<div className='fixed inset-0 bg-black/50 backdrop-blur-2xl z-40'>UserStats</div>
			<div className="fixed inset-0 z-50 flex items-center justify-center">
								<div className="bg-card p-6 rounded-2xl shadow-xl w-[90%] max-w-lg">
									<h2 className="text-xl font-bold mb-4">More Performance Details</h2>
									<p className="text-sm">Here you can add any additional stats or actions you want.</p>
									<div className="mt-4 flex justify-end">
										<button
											// onClick={() => setShowModal(false)}
											className="px-4 py-2 bg-white/10 rounded hover:bg-white/20"
										>
											Close
										</button>
									</div>
								</div>
							</div>
		</>
	);
}
