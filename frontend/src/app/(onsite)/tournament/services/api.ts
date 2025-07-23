const joinTournamentHandler = async (e) => {
	try {
		const req = await fetch(`http://localhost:3008/api/v1/tournament-matches/join/${slug}`, {
			method: "PATCH",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				id: 1, // I need user ID here to make him join the match
			}),
		});

		const data = await req.json();
		if (!req.ok) throw "Something went wrong.";

		console.log(data);
		setJoined(true);
	} catch (err) {
		console.log(err);
	}
};

export { joinTournamentHandler };
