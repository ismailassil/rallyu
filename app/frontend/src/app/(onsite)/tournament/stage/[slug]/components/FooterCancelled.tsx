import unicaOne from "@/app/fonts/unicaOne";

const FooterCancelled = function ({ title, cancelReason }: { title: string, cancelReason: string }) {

    return (
        <div>
           <p className="text-gray-300 sm:text-left text-center mb-1.5 sm:mb-0">
                <span className={`font-black ${unicaOne.className} text-white`}>{ title } </span>
                Tournament got cancelled unfortunately &#128557;
            </p>
           <p className="italic text-red-400 sm:text-left text-center">Reason: { cancelReason } !</p>
        </div>
    );
};

export default FooterCancelled;