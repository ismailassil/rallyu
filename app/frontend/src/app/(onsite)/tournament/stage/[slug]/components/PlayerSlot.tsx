import AnimateLink from "./AnimateLink";

const PlayerSlot = function ({ match, playerNumber }: { match: any, playerNumber: number }) {

    const winnerStyle = (player: number) => {
		if (!match.winner) return "";

		if (match.winner === player) return "text-blue-400";

		return "opacity-50";
	};

    return (
        <div className="flex justify-between px-6 py-3">
            {
                (match[`player_${playerNumber}_username`] && (
                <AnimateLink
                    color={
                        match.winner === match[`player_${playerNumber}`]
                            ? "bg-blue-400"
                            : "bg-white/50"
                    }
                    url={`/users/${match[`player_${playerNumber}_username`]}`}
                >
                    <p
                        className={`${ winnerStyle(match[`player_${playerNumber}`]) } truncate`}
                        title={match[`player_${playerNumber}_username`]}
                    >
                        {match[`player_${playerNumber}_username`]}
                    </p>
                </AnimateLink>
                )) ||
                <p className={`${ winnerStyle(match[`player_${playerNumber}`]) }`}>TBD</p>
            }
            <hr />
            <span className={`${ winnerStyle(match[`player_${playerNumber}`]) } font-black`}>
                {
                    !match.results ?
                        "-" :
                        match.results.split("|")[playerNumber - 1]
                }
            </span>
        </div>
    );
};

export default PlayerSlot;