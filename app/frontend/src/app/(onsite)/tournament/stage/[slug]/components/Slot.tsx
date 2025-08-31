import PlayerSlot from "./PlayerSlot";

const Slot = function ({ match, reverse = 0 }) {

    return (
        <div className="bg-card border-br-card relative flex w-full flex-col border-2">
            <PlayerSlot
                match={match}
                playerNumber={1}
            />
            <PlayerSlot
                match={match}
                playerNumber={2}
            />
            <div
                className={`absolute ${reverse ? "md:-left-[84px] sm:-left-[44px]" : ""}
                        top-1/2 h-px md:w-[calc(100%+84px)] sm:w-[calc(100%+44px)]
                        -translate-y-1/2 bg-gray-300 opacity-20 w-full`}
            >
            </div>
        </div>
    );
};

export default Slot;
