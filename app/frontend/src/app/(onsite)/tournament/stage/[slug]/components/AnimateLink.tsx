import { motion, useAnimation } from "framer-motion";
import Link from "next/link";

const AnimateLink = function (
    { color, url, children }:
    { color: string, url:string, children: React.ReactElement }
) {
    const controls = useAnimation();

    const handleHoverStart = () => {
        controls.start({ width: "100%" });
    };

    const handleHoverEnd = () => {
        controls.start({ width: 0 });
    };

    return (
        <motion.div
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
            className="min-w-0"
        >
                <Link href={url}>
                    { children }
                </Link>
                <motion.div 
                    className={`h-[2px] ${color} rounded-full mx-auto`}
                    initial={{ width: 0 }}
                    animate={controls}
                    transition={{ stiffness: 300 }}
                >
                </motion.div>
        </motion.div>
    );
};

export default AnimateLink;