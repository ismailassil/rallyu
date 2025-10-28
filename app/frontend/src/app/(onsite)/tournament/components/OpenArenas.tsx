import StartButton from "./Items/StartButton";
import Filter from "./Items/Filter";
import TournamentCard from "./Items/TournamentCard";
import { useEffect, useState } from "react";
import unicaOne from "@/app/fonts/unicaOne";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { useSearchParams } from "next/navigation";
import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

interface errorObj {
	status: boolean;
	message: string;
}

const fetchData = async function (api, param, setTournaments, setError) {
	try {
		const req = await api.instance.get(`/v1/tournament/tournaments${param === 'ping-pong' ? "?mode=ping-pong" : param === 'tic-tac-toe' ? "?mode=tic-tac-toe" : ""}`);

		const data = req.data;

		setTournaments(data.data);
	} catch (err: unknown) {
		if (typeof err === "object")
			setError({
				status: true,
				message: "Something went wrong: Service is currently unavailable.",
			});
	}
};

function OpenArenas({ setValue }: { setValue: (value: boolean) => void }) {
	const [tournaments, setTournaments] = useState([]);
	const [error, setError] = useState<errorObj>({ status: false, message: "" });
	const [searchVal, setSearchVal] = useState<string>("");
	const { apiClient, loggedInUser } = useAuth();
	const param: string | null = useSearchParams().get('mode');
	const translate = useTranslations("tournament");

	useEffect(() => {
	
		fetchData(apiClient, param, setTournaments, setError);
	}, [apiClient.instance, loggedInUser?.id]);

	const searchTournament = async function (e) {
		e.preventDefault();

		const val = (e.target as HTMLInputElement).value;
		setSearchVal(val);

		if (!val) {
			fetchData(apiClient, param, setTournaments, setError);
			return ;
		}

		try {
			const mode = param === 'ping-pong' ? "?mode=ping-pong" : param === 'tic-tac-toe' ? "?mode=tic-tac-toe" : "";

			const res = await apiClient.instance.get(`/v1/tournament/tournaments${mode ? `${mode}&search=${val}` : `?search=${val}`}`);

			const data = res.data;

			setTournaments(data.data);
		} catch (err) {
			setError({
				status: true,
				message: translate("panel.error")
			});
		}
	};

	return (
		<>
			<motion.div
				initial={{ opacity: 0, x: -100 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: -100 }}
				transition={{ type: "spring", stiffness: 120 }}
				className="min-h-11 flex items-center justify-between gap-4 flex-wrap"
			>
				<div>
					<h2 className={`${unicaOne.className} text-base uppercase sm:text-2xl`}>
						<span className="font-semibold">{ translate("panel.title") }</span>
					</h2>
				</div>
				<div className="flex gap-3 grow flex-wrap">
					<div 
						className="bg-card flex items-center gap-2
								border-white/20 border px-2 py-2 rounded-md
								has-[input:focus]:bg-white  duration-300 transition-all grow"
					>
						<input 
							id="search"
							type="text"
							className="peer w-full h-full border-none focus:outline-none focus:placeholder:text-background focus:text-black"
							placeholder={ translate("panel.search") }
							onChange={searchTournament}
							maxLength={20}
							value={searchVal}
						/>
						<label htmlFor="search" className="hover:scale-110 peer-focus:text-black duration-300 transition-all order-[-1]">
							<MagnifyingGlassIcon size={21}/>
						</label>
						<button className="text-white peer-focus:text-black duration-300 transition-all">
							{
								searchVal &&
									<XIcon 
										onClick={(e) => {
											e.preventDefault();
											
											fetchData(apiClient, param, setTournaments, setError);
											setSearchVal("");
										}}
										size={21}
										className="hover:cursor-pointer"
									/>
							}
						</button>
					</div>
					<Filter
						setTournaments={setTournaments}
						mode={param === "ping-pong" ? 1 : (param === "tic-tac-toe" ? 2 : 0)}
						setError={setError}
					/>
					<StartButton setValue={setValue} label={ translate("panel.button") } />
				</div>
			</motion.div>
			{error.status && (
				<motion.div
					initial={{ opacity: 0, x: -100 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -100 }}
					transition={{ type: "spring", stiffness: 120 }}
					className="text-wrap rounded-full bg-red-700 px-8 py-4"
				>  
					<p className="text-lg">{error.message}</p>
				</motion.div>
			)}
			{
				(!tournaments.length && !error.status) && (
					<motion.div
						initial={{ opacity: 0, x: -100 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -100 }}
						transition={{ type: "spring", stiffness: 120 }}
						className="text-wrap flex gap-2 rounded-full bg-card outline-white/20 outline-1 px-8 py-4"
					>
						<p className="text-lg">{ translate("panel.not-found") }</p>
					</motion.div>
				)
			}
			{
				tournaments.length > 0 && !error.status && (
					<motion.div
						initial={{ opacity: 0, x: -100 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -100 }}
						transition={{ type: "spring", stiffness: 120 }}
						className="*:border-1 *:border-white/10 *:rounded-sm *:px-2
							*:cursor-pointer *:hover:scale-101 *:duration-400
							*:transition-all
							grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 "
					>
						{
							tournaments.map((el: any) => {
								return (
									<TournamentCard
										key={el.id}
										id={el.id}
										name={el.title}
										active={el.contenders_joined}
										size={el.contenders_size}
										isPingPong={el.mode === "ping-pong"}
										isUserIn={el?.isUserIn ? true : false}
										state={el.state}
									/>
								);
							})
						}
					</motion.div>
				)
			}
		</>
	);
}

export default OpenArenas;
