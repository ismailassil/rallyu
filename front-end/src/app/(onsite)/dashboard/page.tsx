"use client";

import NavBar from "../components/NavBar";
import SideBar from "../components/Sidebar";
import UserInfo from "../components/UserInfo";
import FriendsPanel from "../components/FriendsPanel";
import Tournament from "../components/Tournament";
import SingleFight from "../components/SingleFight";
import TrainingMatch from "../components/TrainingMatch";

export default function Auth() {
	// const router = useRouter();
	// const api = "l";

	return (
		<div className="min-h-screen w-screen">
			<main
				className="grid grid-cols-[6rem_1fr_0.5fr] grid-rows-[4rem_1fr]
					p-6 gap-6 w-full h-full"
			>
				<div className="col-span-3 flex justify-between">
					<NavBar />
				</div>
				<div className="bg-card border-2 border-br-card rounded-lg flex flex-col justify-center items-center gap-16 overflow-hidden">
					<SideBar />
				</div>
				<div className="grid grid-rows-[0.5fr_1fr] gap-6 w-full h-full">
					<div className="bg-card border-2 border-br-card rounded-lg">
						<UserInfo />
					</div>
					<div className="grid gap-6 w-full h-full grid-rows-1 grid-cols-3 md:grid-rows-2 md:grid-cols-2">
						<div
							className="md:row-span-3 md:col-span-full col-span-3 bg-card border-2 border-br-card rounded-lg
						transition-transform duration-500 transform
						hover:cursor-pointer group hover:-translate-y-2"
						>
							<Tournament />
						</div>
						<div
							className="col-span-3 bg-card border-2 border-br-card rounded-lg
						transition-transform duration-500 transform
						hover:cursor-pointer group hover:-translate-y-2"
						>
							<SingleFight />
						</div>
						<div
							className="col-span-3 bg-card border-2 border-br-card rounded-lg
						transition-transform duration-500 transform
						hover:cursor-pointer group hover:-translate-y-2"
						>
							<TrainingMatch />
						</div>
					</div>
				</div>
				<div className="bg-card border-2 border-br-card rounded-lg h-full">
					<FriendsPanel />
				</div>
			</main>
		</div>
	);
}
