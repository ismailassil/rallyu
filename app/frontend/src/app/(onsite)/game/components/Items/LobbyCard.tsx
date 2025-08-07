import { AnimatePresence, motion } from "framer-motion"
import BattleFriend from "./BattleFriend"
import QueueButton from "./QueueButton"
import unicaOne from "@/app/fonts/unicaOne"
import PickGame from "./PickGame"

const LobbyCard = () => {
    return (
        <>
            <h2 className={`p-4 text-4xl ${unicaOne.className} uppercase`}>
                <span className="font-semibold italic">Start A Match</span>
            </h2>
            <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.1 }}
                className={`custom-scroll flex h-full flex-col gap-5 overflow-y-scroll p-4`}
            >
                <PickGame />
                <div className="
                    max-h-[15vh] lg:max-h-full h-full rounded-xl overflow-y-auto overflow-x-hidden custom-scroll
                ">
                    <BattleFriend fullname={"Amine maila"} img={"/profile/image_2.jpg"} />
                    <BattleFriend fullname={"Amine maila"} img={"/profile/image_2.jpg"} />
                    <BattleFriend fullname={"Amine maila"} img={"/profile/image_2.jpg"} />
                    <BattleFriend fullname={"Amine maila"} img={"/profile/image_2.jpg"} />
                    <BattleFriend fullname={"Amine maila"} img={"/profile/image_2.jpg"} />
                    <BattleFriend fullname={"Amine maila"} img={"/profile/image_2.jpg"} />
                    <BattleFriend fullname={"Amine maila"} img={"/profile/image_2.jpg"} />
                    <BattleFriend fullname={"Amine maila"} img={"/profile/image_2.jpg"} />
                    <BattleFriend fullname={"Amine maila"} img={"/profile/image_2.jpg"} />
                    <BattleFriend fullname={"Amine maila"} img={"/profile/image_2.jpg"} />
                    <BattleFriend fullname={"Amine maila"} img={"/profile/image_2.jpg"} />
                    <BattleFriend fullname={"Amine maila"} img={"/profile/image_2.jpg"} />
                </div>
                <QueueButton />
            </motion.div>
        </>

    )
}

export default LobbyCard