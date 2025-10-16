import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';

interface HalfWidthStatDisplayProps {
  stat: { label: string; value: number; suffix: string };
  direction?: 'up' | 'down';
  delay?: number;
}

export const HalfWidthStatDisplay = ({ stat, direction = 'up', delay = 0 }: HalfWidthStatDisplayProps) => {
  const initial = direction === 'up' ? { y: -60 } : { y: 60 };
  const exit = direction === 'up' ? { y: 60 } : { y: -60 };

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={stat.label}
        initial={{ opacity: 0, filter: "blur(5px)", ...initial }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        exit={{ opacity: 0, filter: "blur(5px)", ...exit }}
        transition={{ duration: 0.5, ease: 'easeInOut', delay }}
        className="flex flex-row items-center justify-between lg:flex-row"
      >
        <p className="text-xl text-white/60 font-bold text-start">
          {stat.label.split(' ').map((word, i) => (
            <span key={i} className={i > 0 ? 'block' : ''}>{word}</span>
          ))}
        </p>
        <p className="text-3xl text-white/80 font-bold">
          <CountUp end={stat.value} suffix={stat.suffix} duration={5} useEasing />
        </p>
      </motion.div>
    </AnimatePresence>
  );
};
