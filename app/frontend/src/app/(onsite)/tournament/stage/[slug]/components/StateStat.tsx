import unicaOne from "@/app/fonts/unicaOne";

const StateStat = function ({ statement, color }: { statement: string, color: string }) {

    return (
        <div
            className={`overflow-hidden bg-card  relative text-lg
                    ${unicaOne.className} ${ color }
                    rounded-lg min-h-13 flex items-center px-6
                    border-1 border-white/10 hover:scale-102 duration-400 transition-all
            `}
        >
            <p>{ statement }</p>
            <div
                className="
                    tournament-bg hover:scale-101 duration-900 absolute left-0 top-0
                    h-full w-full opacity-0 transition-all hover:opacity-20
                "
            />
        </div>
    );
};

export default StateStat;