import unicaOne from "@/app/fonts/unicaOne";

const Stat = function ({ subject, result }: { subject: string, result: string }) {

    return (
        <div className=
                {`overflow-hidden bg-card  relative text-lg
                    ${unicaOne.className}
                    rounded-lg min-h-13
                    border-1 border-white/10 hover:scale-102 duration-400 transition-all
                    flex flex-1 justify-between px-4 py-2 lg:text-lg items-center
                `}
        >
            <h3>{ subject }</h3>
            <p className="xl:text-3xl text-2xl">{ result }</p>
            <div
                className="tournament-bg hover:scale-101 duration-900 absolute left-0 top-0
                    h-full w-full opacity-0 transition-all hover:opacity-20"
            />
        </div>
    );
};

export default Stat;