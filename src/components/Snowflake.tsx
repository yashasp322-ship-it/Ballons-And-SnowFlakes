import { motion } from 'motion/react';
import { Snowflake as SnowflakeIcon } from 'lucide-react';
import { SnowflakeItem } from '../types';

interface SnowflakeProps {
  item: SnowflakeItem;
  onComplete: (id: string) => void;
  key?: string;
}

export default function Snowflake({ item, onComplete }: SnowflakeProps) {
  return (
    <motion.div
      className="absolute top-0 pointer-events-none"
      style={{
        left: `${item.x}%`,
        width: `${item.size}px`,
        height: `${item.size}px`,
        opacity: item.opacity,
        zIndex: 5,
        color: '#e2e8f0', // Muted slate-200/ice color
      }}
      initial={{ y: -50, opacity: 0 }}
      animate={{
        y: '105vh',
        opacity: [0, item.opacity, item.opacity, item.opacity * 0.7, 0],
        x: [0, item.sway, -item.sway, item.sway / 2, 0],
        rotate: 360 * (item.rotationSpeed > 0 ? 1 : -1) * (item.duration / 3), // proportionate rotation
      }}
      transition={{
        y: { duration: item.duration, ease: 'linear' },
        opacity: { duration: item.duration, times: [0, 0.1, 0.8, 0.9, 1], ease: 'linear' },
        x: {
          duration: item.swayDuration,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        },
        rotate: {
          duration: item.duration,
          ease: 'linear',
        }
      }}
      onAnimationComplete={() => onComplete(item.id)}
    >
      <SnowflakeIcon
        strokeWidth={1.2}
        className="w-full h-full text-slate-300 drop-shadow-[0_1px_3px_rgba(255,255,255,0.4)]"
      />
    </motion.div>
  );
}
