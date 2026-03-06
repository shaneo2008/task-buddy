import { motion } from "framer-motion";
import { useRef, useEffect } from "react";

/*
 * Task Item SVG — The items Rex eats
 * Each item is a simple, cute SVG illustration
 *
 * Animation:
 * - Idle: gentle float via framer-motion
 * - Flying: CSS spring-curve transition (cubic-bezier(0.34, 1.56, 0.64, 1))
 *   triggered by `isFlying` prop — translates item toward Rex's mouth
 * - Hidden: opacity 0 after eaten
 */

interface TaskItemSVGProps {
  itemId: string;
  isFlying: boolean;
  isHidden: boolean;
  className?: string;
}

export default function TaskItemSVG({ itemId, isFlying, isHidden, className = "" }: TaskItemSVGProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Apply CSS transition-based flight path when isFlying becomes true
  useEffect(() => {
    if (isFlying && ref.current) {
      // Fly toward Rex's mouth (roughly center-left and down)
      ref.current.style.transform = "translate(-40px, 80px) scale(0.3) rotate(-30deg)";
    }
  }, [isFlying]);

  if (isHidden) return null;

  return (
    <div
      ref={ref}
      className={`item-fly-to-mouth ${className}`}
      style={{
        transform: "translate(0, 0) scale(1) rotate(0deg)",
        opacity: isHidden ? 0 : 1,
      }}
    >
      {/* Idle float wrapper — only animates when not flying */}
      <motion.div
        animate={
          !isFlying
            ? {
                y: [0, -6, 0],
                rotate: [0, 3, -3, 0],
              }
            : {}
        }
        transition={
          !isFlying
            ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" as const }
            : {}
        }
      >
        <svg viewBox="0 0 80 80" width="64" height="64" className="drop-shadow-md">
          {renderItem(itemId)}
        </svg>
      </motion.div>
    </div>
  );
}

function renderItem(itemId: string) {
  switch (itemId) {
    case "pajamas":
      return (
        <g>
          {/* Folded pajamas with stars */}
          <rect x="12" y="20" width="56" height="45" rx="8" fill="#C4B5FD" />
          <rect x="16" y="24" width="48" height="37" rx="6" fill="#DDD6FE" />
          {/* Collar fold */}
          <path d="M28 24 L40 32 L52 24" fill="#C4B5FD" stroke="#A78BFA" strokeWidth="1" />
          {/* Stars */}
          <text x="25" y="50" fontSize="12">⭐</text>
          <text x="45" y="45" fontSize="10">⭐</text>
          <text x="35" y="58" fontSize="8">✨</text>
          {/* Sleeves */}
          <rect x="8" y="30" width="12" height="20" rx="5" fill="#C4B5FD" />
          <rect x="60" y="30" width="12" height="20" rx="5" fill="#C4B5FD" />
        </g>
      );

    case "brush-teeth":
      return (
        <g>
          {/* Toothbrush handle */}
          <rect x="15" y="35" width="45" height="10" rx="5" fill="#5BC0EB" />
          <rect x="15" y="35" width="15" height="10" rx="5" fill="#3DA8D3" />
          {/* Bristles */}
          <rect x="55" y="30" width="15" height="20" rx="3" fill="white" stroke="#E0E0E0" strokeWidth="1" />
          {/* Bristle lines */}
          <line x1="58" y1="33" x2="58" y2="47" stroke="#B0E0FF" strokeWidth="1.5" />
          <line x1="62" y1="33" x2="62" y2="47" stroke="#B0E0FF" strokeWidth="1.5" />
          <line x1="66" y1="33" x2="66" y2="47" stroke="#B0E0FF" strokeWidth="1.5" />
          {/* Sparkle */}
          <text x="60" y="22" fontSize="14">✨</text>
        </g>
      );

    case "potty":
      return (
        <g>
          {/* Toilet paper roll */}
          <ellipse cx="40" cy="40" rx="22" ry="22" fill="white" stroke="#E8DCC8" strokeWidth="2" />
          <ellipse cx="40" cy="40" rx="8" ry="8" fill="#F5F0E8" stroke="#E8DCC8" strokeWidth="1.5" />
          {/* Paper trail */}
          <path d="M62 40 Q70 40 70 50 Q70 60 60 62 Q50 64 48 58" fill="none" stroke="white" strokeWidth="6" />
          <path d="M62 40 Q70 40 70 50 Q70 60 60 62 Q50 64 48 58" fill="none" stroke="#E8DCC8" strokeWidth="1.5" />
          {/* Cute face */}
          <circle cx="34" cy="37" r="2" fill="#8B6D4E" />
          <circle cx="46" cy="37" r="2" fill="#8B6D4E" />
          <path d="M36 44 Q40 48 44 44" stroke="#8B6D4E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
      );

    case "pick-book":
      return (
        <g>
          {/* Book cover */}
          <rect x="14" y="15" width="52" height="50" rx="4" fill="#FF6B6B" />
          {/* Book spine */}
          <rect x="14" y="15" width="8" height="50" rx="2" fill="#E55555" />
          {/* Pages */}
          <rect x="22" y="18" width="40" height="44" rx="2" fill="#FFF5E6" />
          {/* Title lines */}
          <rect x="28" y="30" width="28" height="3" rx="1.5" fill="#FFB5B5" />
          <rect x="28" y="38" width="20" height="3" rx="1.5" fill="#FFB5B5" />
          {/* Star decoration */}
          <text x="34" y="56" fontSize="14">⭐</text>
        </g>
      );

    case "lights-off":
      return (
        <g>
          {/* Moon crescent */}
          <circle cx="40" cy="38" r="22" fill="#FFD93D" />
          <circle cx="50" cy="32" r="18" fill="#FFF9EE" />
          {/* Stars around */}
          <text x="12" y="25" fontSize="10">⭐</text>
          <text x="55" y="20" fontSize="8">✨</text>
          <text x="60" y="55" fontSize="10">⭐</text>
          <text x="15" y="60" fontSize="8">✨</text>
          {/* Zzz */}
          <text x="50" y="45" fontSize="12" fill="#8B6D4E" fontFamily="Fredoka" fontWeight="600">z</text>
          <text x="58" y="38" fontSize="10" fill="#8B6D4E" fontFamily="Fredoka" fontWeight="600">z</text>
          <text x="64" y="32" fontSize="8" fill="#8B6D4E" fontFamily="Fredoka" fontWeight="600">z</text>
        </g>
      );

    default:
      return (
        <g>
          <circle cx="40" cy="40" r="20" fill="#E8DCC8" />
          <text x="40" y="46" textAnchor="middle" fontSize="20">❓</text>
        </g>
      );
  }
}
