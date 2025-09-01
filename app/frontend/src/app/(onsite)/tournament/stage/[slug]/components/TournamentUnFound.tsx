import { SmileyXEyesIcon } from "@phosphor-icons/react";

const TournamentUnFound = function () {

    return (
        <div className="self-center my-auto flex flex-col items-center justify-center gap-2">
            <SmileyXEyesIcon weight="fill" className="text-9xl" />
            <h1 className="sm:text-xl text-lg font-bold">Tournament Not Found</h1> 
        </div>
    );
};

export default TournamentUnFound;