import { motion } from 'motion/react';
import { BalloonItem } from '../types';

interface BalloonProps {
  item: BalloonItem;
  onComplete: (id: string) => void;
  key?: string;
}

export default function Balloon({ item, onComplete }: BalloonProps) {
  // Generate a unique gradient ID for each balloon to avoid overlap
  const gradientId = `balloon-grad-${item.id}`;
  const highlightId = `balloon-high-${item.id}`;

  return (
    <motion.div
      className="absolute bottom-0 pointer-events-none"
      style={{
        left: `${item.x}%`,
        width: `${item.size}px`,
        height: `${item.size * item.aspectRatio + 60}px`, // Add space for the string
        zIndex: 10,
      }}
      initial={{ y: '100% ', opacity: 0 }}
      animate={{
        y: '-110vh',
        opacity: [0, 1, 1, 0.8, 0],
        x: [0, item.sway, -item.sway, item.sway / 2, 0],
        rotate: [item.tilt, item.tilt + 5, item.tilt - 5, item.tilt],
      }}
      transition={{
        y: { duration: item.duration, ease: 'easeOut' },
        opacity: { duration: item.duration, times: [0, 0.05, 0.85, 0.95, 1], ease: 'linear' },
        x: {
          duration: item.swayDuration,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        },
        rotate: {
          duration: item.swayDuration * 1.5,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        },
      }}
      onAnimationComplete={() => onComplete(item.id)}
    >
      <svg
        viewBox="0 0 32 72"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          {/* Radial Gradient for 3D sphere look */}
          <radialGradient id={gradientId} cx="35%" cy="30%" r="55%" fx="35%" fy="30%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.4} />
            <stop offset="35%" stopColor={item.color} stopOpacity={0.9} />
            <stop offset="100%" stopColor={item.color} />
          </radialGradient>

          {/* Core shadow gradient */}
          <linearGradient id={`${gradientId}-sh`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#000000" stopOpacity={0} />
            <stop offset="100%" stopColor="#000000" stopOpacity={0.25} />
          </linearGradient>
        </defs>

        {/* The elegant, long string */}
        <path
          d="M 16 43 Q 12 52 18 61 T 14 70"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="0.75"
          strokeLinecap="round"
          className="opacity-70"
        />

        {/* Small transition knot */}
        <polygon
          points="14,41 18,41 16,44"
          fill={item.color}
          stroke="none"
        />

        {/* Main Balloon shape */}
        <path
          d="M 16 2 
             C 7 2, 2 10, 2 20 
             C 2 31, 8 41, 16 41 
             C 24 41, 30 31, 30 20 
             C 30 10, 25 2, 16 2 Z"
          fill={`url(#${gradientId})`}
        />

        {/* Premium Shadow Overlay */}
        <path
          d="M 16 2 
             C 7 2, 2 10, 2 20 
             C 2 31, 8 41, 16 41 
             C 24 41, 30 31, 30 20 
             C 30 10, 25 2, 16 2 Z"
          fill={`url(#${gradientId}-sh)`}
          className="mix-blend-multiply"
        />

        {/* Glossy Highline / Highlight Arc */}
        <path
          d="M 5 15 A 11 11 0 0 1 18 4"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.25"
          strokeLinecap="round"
          className="opacity-50"
        />
      </svg>
    </motion.div>
  );
}
