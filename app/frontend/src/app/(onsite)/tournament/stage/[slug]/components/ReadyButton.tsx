import { useState } from "react";


const ReadyButton = function ({ slug, readyProp } : { slug: number, readyProp: boolean }) {
    const [ready, setReady] = useState<boolean>(readyProp);


    const playerReadyHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
		try {
			event.preventDefault();

			const req: Response = await fetch(`http://localhost:3008/api/v1/tournament-matches/ready/${slug}`, {
				method: "PATCH",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify({
					id: 1, // I need user ID here to make him join the match
				}),
			});

			const data = await req.json();
			if (!req.ok)
				throw data;

			console.log(data);
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