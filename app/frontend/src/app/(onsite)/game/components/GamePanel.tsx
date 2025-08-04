import unicaOne from "@/app/fonts/unicaOne";
import { AnimatePresence, motion } from "framer-motion";
import QueueButton from "./Items/QueueButton";
import PickGame from "./Items/PickGame";
import BattleFriend from "./BattleFriend";

function GamePanel() {
	return (
		<div className="flex w-full gap-4 flex-col lg:flex-row">
			<AnimatePresence>
				<div className="basis-2/3 w-full border border-white/15 bg-card rounded-md">
					{/* Game Goes Here */}
				</div>
			</AnimatePresence>
			<AnimatePresence>
				<div className="hide-scrollbar bg-card border border-white/15 rounded-md flex basis-1/3 w-full flex-col">
					<h2 className={`p-4 text-4xl ${unicaOne.className} uppercase`}>
						<span className="font-semibold italic">Start A Match</span>
					</h2>
					<motion.div
						initial={{ opacity: 0, y: -100 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1, delay: 0.1 }}
						className={`custom-scroll flex h-full flex-col gap-5 overflow-y-scroll p-4`}
					>
						<PickGame />
						<div className="relative overflow-auto">
							<div className="max-h-[15vh] lg:h-full lg:max-h-full overflow-y-auto overflow-x-hidden custom-scroll">
								<BattleFriend fullname={"Amine maila"} img={"/profile/image_2.jpg"} />
								<BattleFriend fullname={"Amine maila"} img={"/profile/image_2.jpg"} />
								<BattleFriend fullname={"Amine maila"} img={"/profile/image_2.jpg"} />
								<BattleFriend fullname={"Amine maila"} img={"/profile/image_2.jpg"} />
								<BattleFriend fullname={"Amine maila"} img={"/profile/image_2.jpg"} />
								<BattleFriend fullname={"Amine maila"} img={"/profile/image_2.jpg"} />
								<BattleFriend fullname={"Amine maila"} img={"/profile/image_2.jpg"} />
								<BattleFriend fullname={"Amine maila"} img={"/profile/image_2.jpg"} />
								<BattleFriend fullname={"Amine maila"} img={"/profile/image_2.jpg"} />
								<BattleFriend fullname={"Amine maila"} img={"/profile/image_2.jpg"} />
								<BattleFriend fullname={"Amine maila"} img={"/profile/image_2.jpg"} />
							</div>
						</div>
						<QueueButton onToggle={null}/>
					</motion.div>
				</div>
			</AnimatePresence>
		</div>
	);
}

export default GamePanel;
