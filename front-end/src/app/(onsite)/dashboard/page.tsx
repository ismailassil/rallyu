"use client";

import UserInfo from "../components/UserInfo";
import FriendsPanel from "../components/FriendsPanel";
import Tournament from "../components/Tournament";
import SingleFight from "../components/SingleFight";
import TrainingMatch from "../components/TrainingMatch";

export default function Dashboard() {
	return (
		<main className="fixed inset-0 flex gap-6 mx-0 sm:ml-37 ml-6 mt-30 mr-6 mb-6 h-[calc(100vh-208px)] sm:h-[calc(100vh-148px)] overflow-auto">
			<article className="grid grid-cols-[1fr] md:grid-rows-[0.5fr_1fr] grid-rows-[1fr_fr] gap-6 h-full w-full flex-2 hide-scrollbar overflow-auto">
				<UserInfo />
				{/* min-h-[330px] */}
				<div className="flex flex-col lg:flex-row space-x-6 space-y-6 lg:space-y-0 h-full">
					<Tournament />
					<div className="flex flex-col space-y-6 h-full flex-1">
						<SingleFight />
						<TrainingMatch />
					</div>
				</div>
			</article>
			<FriendsPanel />
		</main>
	);
}
