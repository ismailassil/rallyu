import { motion } from "framer-motion";
import { SmileyMeltingIcon, SmileyNervousIcon } from "@phosphor-icons/react";
import { Dispatch, SetStateAction } from "react";

function HostIn({ hostIn, setHostIn }: { hostIn: boolean, setHostIn: Dispatch<SetStateAction<boolean>> }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="min-h-11 flex flex-col items-center justify-between gap-2 text-sm md:flex-row lg:gap-20 lg:text-base md:mb-0 mb-5"
        >
            <label className="w-full flex-1" htmlFor="picture">
                Join Tournament
            </label>
            <div className="flex-2 w-full">
                <div
                    className={`*:flex *:justify-center *:items-center *:px-1
                            *:py-1 *:rounded-sm *:gap-2 *:hover:scale-101 *:transform *:transition-all *:duration-200 *:cursor-pointer flex gap-2
                            rounded-md border-2 border-white/10 px-1 py-1`}
                >
                    <div
                        onClick={(e) => {
                            e.preventDefault();
                            setHostIn(true);
                        }}
                        className={`w-full ${
                            hostIn ? "bg-white text-black" : "hover:bg-white hover:text-black"
                        }`}
                    >
                        <SmileyMeltingIcon size={18} />
                        In
                    </div>
                    <div
                        onClick={(e) => {
                            e.preventDefault();
                            setHostIn(false);
                        }}
                        className={`w-full ${
                            !hostIn ? "bg-white text-black" : "hover:bg-white hover:text-black"
                        }`}
                    >
                        <SmileyNervousIcon size={18} />
                        Out
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default HostIn;
