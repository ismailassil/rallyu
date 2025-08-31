import { SmileyXEyesIcon } from "@phosphor-icons/react";

const TournamentUnFound = function () {

    return (
        <div className="self-center my-auto flex flex-col items-center justify-center gap-2">
            <SmileyXEyesIcon size={132} weight="fill" />
            <h1 className="text-xl font-bold">Tournament Not Found</h1> 
        </div>
    );
};

export default TournamentUnFound;