import unicaOne from "@/app/fonts/unicaOne";
import { useTranslations } from "next-intl";

const FooterCancelled = function ({ title, cancelReason }: { title: string, cancelReason: string }) {
    const translate = useTranslations("tournament")

    return (
        <div>
           <p className="text-gray-300 sm:text-left text-center mb-1.5 sm:mb-0">
                <span className={`font-black ${unicaOne.className} text-white`}>{ title } </span>
                { translate("bracket.cancel.header") } &#128557;
            </p>
           <p className="italic text-red-400 sm:text-left text-center">{translate("bracket.cancel.reason-label")}: {
                cancelReason.includes("Two") ? translate("bracket.cancel.reason-not-player") : translate("bracket.cancel.reason-forfeit") 
            } !</p>
        </div>
    );
};

export default FooterCancelled;