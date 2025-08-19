import unicaOne from "@/app/fonts/unicaOne";

const FooterCancelled = function ({ title }: { title: string }) {

    return (
        <div>
           <p className="text-gray-300">
                <span className={`font-black ${unicaOne.className}`}>{ title } </span>
                Tournament got cancelled unfortunately &#128557;
            </p>
           <p className="italic text-red-300">Reason: not enough players to participate!</p>
        </div>
    );
};

export default FooterCancelled;