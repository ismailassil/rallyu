import { useState } from "react";


const ReadyButton = function ({ slug } : { slug: number }) {
    const [ready, setReady] = useState<boolean>(false);


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
            setReady(true);
		} catch (err: unknown) {
			console.error(err);
		}
	};

	return  (
		<div className="w-full flex justify-center mt-auto mb-20">
			{
				!ready &&
				<button 
					className="hover:cursor-pointer bg-yellow-600 text-xl px-10 py-3 rounded-xl"
					onClick={playerReadyHandler}
				>
					I am Ready!
				</button>
			}
		</div>
	);
};

export default ReadyButton;