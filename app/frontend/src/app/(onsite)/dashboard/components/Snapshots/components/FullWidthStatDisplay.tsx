import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';

interface FullWidthStatDisplayProps {
  stat: { label: string; value: number; suffix: string };
  direction?: 'left' | 'right';
  delay?: number;
}

export const FullWidthStatDisplay = ({ stat, direction = 'left', delay = 0 }: FullWidthStatDisplayProps) => {
  const initial = direction === 'left' ? { x: -50 } : { x: 50 };
  const exit = direction === 'left' ? { x: 50 } : { x: -50 };

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={stat.label}
        initial={{ opacity: 0, filter: "blur(5px)", ...initial }}
        animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
        exit={{ opacity: 0, filter: "blur(5px)", ...exit }}
        transition={{ duration: 0.5, ease: 'easeInOut', delay }}
        className="flex flex-row items-center justify-between lg:flex-row"
      >
        <p className="text-2xl text-white/60 font-bold">{stat.label}</p>
        <p className="text-3xl text-white/80 font-bold">
          <CountUp end={stat.value} suffix={stat.suffix} duration={5} useEasing />
        </p>
      </motion.div>
    </AnimatePresence>
  );
};
