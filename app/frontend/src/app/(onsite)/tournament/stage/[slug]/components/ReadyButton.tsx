import { useAuth } from "@/app/(onsite)/contexts/AuthContext";
import { AxiosResponse } from "axios";
import { useState } from "react";


const ReadyButton = function ({ slug, readyProp } : { slug: number, readyProp: boolean }) {
    const [ready, setReady] = useState<boolean>(readyProp);
	const { apiClient } = useAuth();


    const playerReadyHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
		try {
			event.preventDefault();
			const res: AxiosResponse = await apiClient.instance.patch(`/v1/tournament/match/ready/${slug}`);

			console.log(res);

            setReady(!ready);
		} catch (err: unknown) {
			console.error(err);
		}
	};

	return  (
		<div className="w-full flex flex-col items-center gap-3 justify-center mt-auto mb-auto">
			{
				!ready ?
				<button 
					className="cursor-pointer bg-yellow-600 text-xl px-10 py-3 rounded-xl"
					onClick={playerReadyHandler}
				>
					I am Ready!
				</button> :
				<button 
					className="bg-card px-20 py-3 outline-white/20 outline-1 rounded-sm cursor-pointer"
					onClick={playerReadyHandler}
				>
					Cancel
				</button>

			}
			<p className="text-zinc-500 font-medium outline px-4">
				Press ready to join the match before the timer runs out!
			</p>
		</div>
	);
};

export default ReadyButton;