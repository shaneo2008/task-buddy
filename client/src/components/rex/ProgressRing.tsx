import { type ReactNode } from "react";
import { motion } from "framer-motion";

/*
 * ProgressRing — Circular countdown timer
 * Design: Thick stroke, rounded caps, smooth animation
 * Shows time remaining in MM:SS format below the centered children.
 *
 * The `children` prop allows placing the Lottie character (or any content)
 * in the exact center of the ring, with the timer text beneath it.
 *
 * When timeLeft === 0, the outer <circle> gets .ring-impatient
 * which applies a CSS pulse animation + orange stroke.
 */

interface ProgressRingProps {
  timeLeft: number;
  totalTime: number;
  themeColor: string;
  size?: number;
  strokeWidth?: number;
  children?: ReactNode;
}

export default function ProgressRing({
  timeLeft,
  totalTime,
  themeColor,
  size = 220,
  strokeWidth = 12,
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? timeLeft / totalTime : 0;
  const strokeDashoffset = circumference * (1 - progress);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  const isUrgent = timeLeft <= 10 && timeLeft > 0;
  const isImpatient = timeLeft === 0;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isImpatient ? undefined : "rgba(232, 220, 200, 0.3)"}
          strokeWidth={strokeWidth}
          className={isImpatient ? "ring-impatient" : ""}
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={isImpatient ? "#FF9800" : themeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "linear" as const }}
          style={{ filter: isUrgent ? "url(#glow)" : "none" }}
          className={isImpatient ? "ring-impatient" : ""}
        />
        {/* Glow filter for urgent state */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Center content: Lottie character + timer */}
      <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
        {/* Lottie character (or other children) */}
        {children}

        {/* Timer display */}
        <motion.span
          className="font-display text-2xl font-bold leading-none"
          style={{ color: isImpatient ? "#FF9800" : themeColor }}
          animate={
            isUrgent
              ? {
                  scale: [1, 1.1, 1],
                  transition: { duration: 0.5, repeat: Infinity },
                }
              : { scale: 1 }
          }
        >
          {timeDisplay}
        </motion.span>
        {isImpatient && (
          <motion.span
            className="text-xs font-semibold text-muted-foreground mt-0.5"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Time's up!
          </motion.span>
        )}
      </div>
    </div>
  );
}
