"use client";

import NavBar from "../components/NavBar";
import SideBar from "../components/Sidebar";
import UserInfo from "../components/UserInfo";

export default function Auth() {
	// const router = useRouter();
	// const api = "l";

	return (
		<div className="h-screen w-screen">
			<main
				className="grid grid-cols-[6rem_1fr_0.5fr] grid-rows-[6rem_1fr]
					p-6 gap-6 w-full h-full"
			>
				<div className="col-span-3 flex justify-between">
					<NavBar />
				</div>
				<div className="bg-card border-2 border-br-card rounded-lg flex flex-col justify-center items-center gap-16 overflow-hidden">
					<SideBar />
				</div>
				<div className="grid grid-cols-2 grid-rows-3 gap-6 w-full h-full">
					<div className="bg-card border-2 border-br-card rounded-lg col-span-2">
						<UserInfo />
					</div>
					<div className="bg-card border-2 border-br-card rounded-lg row-span-2">
						2
					</div>
					<div className="bg-card border-2 border-br-card rounded-lg">3</div>
					<div className="bg-card border-2 border-br-card rounded-lg col-start-2 row-start-3">
						4
					</div>
				</div>
				<div className="bg-card border-2 border-br-card rounded-lg">
					Right Panel
				</div>
			</main>
		</div>
	);
}
