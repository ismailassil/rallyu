import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { HashIcon, PingPongIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

interface errorObj {
	status: boolean;
	message: string;
}

function Filter(
	{ setTournaments, mode, setError }:
	{ setTournaments: Dispatch<SetStateAction<never[]>>, mode: number, setError: Dispatch<SetStateAction<errorObj>> }
) {
	const [filter, setFilter] = useState(mode);
	const { api } = useAuth();
	const router = useRouter();

	const filterTournaments = async function (e) {
		e.preventDefault();
		try {
			if (filter === 0 || filter !== this) {
				const req = await api.instance.get(
					`/v1/tournament/tournaments?mode=${this === 1 ? "ping-pong" : "tic-tac-toe"}`
				);

				const data = req.data;
				
				setTournaments(data.data);
				setFilter(this);
				router.push(`/tournament?mode=${this === 1 ? "ping-pong" : "tic-tac-toe"}`);
			} else {
				const req = await api.instance.get(`/v1/tournament/tournaments`);

				const data = req.data;

				setTournaments(data.data);
				setFilter(0);
				router.push("/tournament");
			}
		} catch(err: unknown) {
			setError({
				status: true,
				message: "Something went wrong"
			});
		}
	};

	return (
		<div
			className="border-1 min-w-30 min-h-10 *:cursor-pointer *:hover:bg-white/80 *:hover:text-black
				*:transition-all *:duration-300 *:flex-1 *:flex *:items-center *:w-full
				*:h-full *:p-1 *:rounded-sm group
				relative flex max-h-10 
				items-center justify-center gap-1 rounded-lg border-white/20 bg-white/5 p-1.5 text-sm"
		>
			<PingPongIcon
				size={10}
				className={filter === 1 ? "bg-white text-black" : ""}
				onClick={filterTournaments.bind(1)}
			/>
			<HashIcon
				size={10}
				className={filter === 2 ? "bg-white text-black" : ""}
				onClick={filterTournaments.bind(2)}
			/>
		</div>
	);
}

export default Filter;
