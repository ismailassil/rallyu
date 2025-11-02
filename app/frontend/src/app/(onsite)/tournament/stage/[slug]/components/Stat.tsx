import unicaOne from "@/app/fonts/unicaOne";
import AnimateLink from "./AnimateLink";
import Avatar from "@/app/(onsite)/users/components/Avatar";

const Stat = function ({ subject, result }: { subject: string, result: string }) {

    return (
        <div className=
                {`overflow-hidden bg-card  relative text-base
                    ${unicaOne.className}
                    rounded-lg min-h-20
                    border border-white/10 hover:scale-102 duration-400 transition-all
                    flex flex-1 justify-between px-4 py-2 md:text-lg items-center
                `}
        >
            <h3 className="peer">{ subject }</h3>
            <div className="peer">
                {
                    subject !== "Host" ?
                    <p className="xl:text-3xl md:text-2xl text-xl">{ result }</p> :
                    <AnimateLink
                        color="bg-white"
                        url={`/users/${result}`}
                    >
                        <p className="xl:text-3xl md:text-2xl text-xl hover:cursor-pointer">{ result }</p>
                    </AnimateLink>
                }
            </div>
            <div
                className="tournament-bg peer-hover::scale-101 hover::scale-101 duration-900 absolute left-0 top-0
                    h-full w-full opacity-0 transition-all peer-hover:opacity-20 hover:opacity-20 -z-10"
            />
        </div>
    );
};

export default Stat;