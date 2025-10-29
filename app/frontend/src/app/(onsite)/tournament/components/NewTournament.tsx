import unicaOne from "@/app/fonts/unicaOne";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useState } from "react";
import GameChoice from "./Items/GameChoice";
import TournamentTitle from "./Items/TournamentTitle";
import StartDate from "./Items/StartDate";
import StartButtonTournament from "./Items/StartButtonTournament";
import { useAuth } from "../../contexts/AuthContext";
import { Toaster } from "sonner";
import { toastSuccess } from '@/app/components/CustomToast';
import HostIn from "./Items/HostIn";
import { useTranslations } from "next-intl";

function NewTournament({ setValue }: { setValue: (value: boolean) => void }) {
	const { loggedInUser, apiClient } = useAuth();
	const [game, setGame] = useState<number>(0);
	const [access, setAccess] = useState<number>(0);
	const [date, setDate] = useState<string>("");
	const [title, setTitle] = useState<string>("");
	const [hostIn, setHostIn] = useState<boolean>(true);
	const [errTitle, setErrTitle] = useState(false);
	const [errGame, setErrGame] = useState(false);
	// const [errAcess, setErrAccess] = useState(false);
	const [errDate, setErrDate] = useState({ status: false, message: "" });
	const [error, setError] = useState({ status: true, message: "" })
	const translate = useTranslations("tournament")

	const createTournamentHandler = async function (e) {
		try {
			e.preventDefault();

			const time = new Date().getTime();
			const dateTime = new Date(date).getTime();

			if (title.trim().length > 15 || title.trim().length < 2) return setErrTitle(true);
			if (![0, 1].includes(game)) return setErrGame(true);

			// Comment This to test date without having to wait for an hour to do
			if (!date || (dateTime - time) / (1000 * 60) < 3) return setErrDate({ status: true, message: translate("panel.new-tournament.t-date-error-time") });

			await apiClient.instance.post('/v1/tournament/create', {
				title,
				game,
				access,
				date,
				hostIn,
				host_id: loggedInUser?.id,
			});

			toastSuccess(translate("panel.new-tournament.t-created"));

			setDate("");
			setAccess(0);
			setGame(0);
			setTitle("");
			setHostIn(true);
			setError({ status: false, message: "" })
			setErrDate({ status: false, message: "" })
			setErrTitle(false);
			setErrGame(false);

			setTimeout(() => {
				setValue(false);
			}, 150);
		} catch (err: any) {
			console.error(err)
			if (!err.response.data?.code)
				setError({ status: true, message: translate("panel.new-tournament.t-date-error") })
			else if (err.response.data.code === 1)
				setErrDate({ status: true, message: translate("panel.new-tournament.t-date-error-nan") });
			else if (err.response.data.code === 2)
				setErrDate({ status: true, message: translate("panel.new-tournament.t-date-error-format") });
			else if (err.response.data.code === 3)
				setErrDate({ status: true, message: translate("panel.new-tournament.t-date-error-time") });
			else if (err.response.data.code === 4)
				setErrGame(true);
			else if (err.response.data.code === 5)
				setErrTitle(true);
		}
	};

	return (
		<>
			<motion.div
				initial={{ opacity: 0, x: 100 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: 100 }}
				transition={{ type: "spring", stiffness: 120 }}
				className="min-h-11 flex gap-10 items-center justify-between"
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
						<ArrowLeftIcon size={24} className="flex-1" />
					</div>
					<h2 className={`${unicaOne.className} text-xl uppercase md:text-2xl`}>
						<span className="font-semibold">{translate("panel.new-tournament.title")}</span>
					</h2>
				</div>
				<StartButtonTournament
					label={translate("panel.new-tournament.button")}
					createTournamentHandler={createTournamentHandler}
				/>
			</motion.div>
			{error.status && <p className=" text-red-500">{error.message}</p>}
			<div className="space-y-2">
				<TournamentTitle value={title} setValue={setTitle} error={errTitle} setError={setErrTitle} />
				<GameChoice game={game} setGame={setGame} error={errGame} setError={setErrGame} />
				<StartDate date={date} setDate={setDate} error={errDate} setError={setErrDate} />
				<HostIn hostIn={hostIn} setHostIn={setHostIn} />
				<Toaster position='bottom-right' visibleToasts={1} />
			</div>
		</>
	);
}

export default NewTournament;
