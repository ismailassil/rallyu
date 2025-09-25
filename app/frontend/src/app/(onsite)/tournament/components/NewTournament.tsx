import unicaOne from "@/app/fonts/unicaOne";
import { ArrowLeft } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import GameChoice from "./Items/GameChoice";
import TournamentTitle from "./Items/TournamentTitle";
import StartDate from "./Items/StartDate";
import StartButtonTournament from "./Items/StartButtonTournament";
import Access from "./Items/AccessChoice";
import { useAuth } from "../../contexts/AuthContext";
import { AxiosResponse } from "axios";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { alertSuccess } from "@/app/(auth)/components/Alert";
import { useRouter } from "next/navigation";
import HostIn from "./Items/HostIn";

function NewTournament({ setValue }: { setValue: (value: boolean) => void }) {
	const { loggedInUser, apiClient } = useAuth();
	const [game, setGame] = useState<number>(0);
	const [access, setAccess] = useState<number>(0);
	const [date, setDate] = useState<string>("");
	const [title, setTitle] = useState<string>("");
	const [hostIn, setHostIn] = useState<boolean>(true);
	const [errTitle, setErrTitle] = useState(false);
	const [errGame, setErrGame] = useState(false);
	const [errAcess, setErrAccess] = useState(false);
	const [errDate, setErrDate] = useState(false);

	const createTournamentHandler = async function (e) {
		try {
			e.preventDefault();

			const time = new Date().getTime();
			const dateTime = new Date(date).getTime();

			if (title.trim().length > 15 || title.trim().length < 2) return setErrTitle(true);
			if (![0, 1].includes(access)) return setErrAccess(true);
			if (![0, 1].includes(game)) return setErrGame(true);
			// if (!date || (dateTime - time) / (1000 * 60) < 30) return setErrDate(true);

			const res: AxiosResponse = await apiClient.instance.post('/v1/tournament/create', {
				title,
				game,
				access,
				date,
				host_id: loggedInUser?.id,
			});

			alertSuccess(res.data.message);

			setDate("");
			setAccess(0);
			setGame(0);
			setTitle("");
			setHostIn(true);

			setTimeout(() => {
				setValue(false);
			}, 2000);
		} catch (err) {
			setErrDate(true);
		}
	};

	return (
		<>
			<motion.div
				initial={{ opacity: 0, x: 100 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: 100 }}
				transition={{ type: "spring", stiffness: 120 }}
				className="min-h-11 flex items-center justify-between"
			>
				<div className="flex items-center gap-3 md:gap-5">
					<div
						className="bg-white/1 ring-white/13 cursor-pointer rounded-sm px-2 py-1 ring-1 transition-all
							duration-200 hover:bg-white/5 hover:ring-2 hover:ring-white/20 md:px-4"
						onClick={(e) => {
							e.preventDefault();
							setValue(false);
						}}
					>
						<ArrowLeft size={24} className="flex-1" />
					</div>
					<h2 className={`${unicaOne.className} text-xl uppercase md:text-2xl`}>
						<span className="font-semibold">Set the Stage</span>
					</h2>
				</div>
				<StartButtonTournament
					label="Create Tournament"
					createTournamentHandler={createTournamentHandler}
				/>
			</motion.div>
			<TournamentTitle value={title} setValue={setTitle} error={errTitle} setError={setErrTitle} />
			<GameChoice game={game} setGame={setGame} error={errGame} setError={setErrGame} />
			{/* <Access access={access} setAccess={setAccess} error={errAcess} setError={setErrAccess} /> */}
			<StartDate date={date} setDate={setDate} error={errDate} setError={setErrDate} />
			<HostIn hostIn={hostIn} setHostIn={setHostIn} />
			<Toaster position='bottom-right' visibleToasts={1} />
		</>
	);
}

export default NewTournament;
