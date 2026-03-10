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

    case "eat-breakfast":
      return (
        <g>
          {/* Bowl */}
          <ellipse cx="40" cy="50" rx="26" ry="10" fill="#FFB347" />
          <path d="M14 45 Q14 62 40 62 Q66 62 66 45 Z" fill="#FFCF87" />
          <ellipse cx="40" cy="45" rx="26" ry="10" fill="#FFE4B2" stroke="#FFB347" strokeWidth="2" />
          {/* Cereal / food */}
          <circle cx="33" cy="43" r="3" fill="#FF6B6B" />
          <circle cx="42" cy="41" r="3" fill="#7BC74D" />
          <circle cx="50" cy="44" r="3" fill="#FF6B6B" />
          <circle cx="38" cy="47" r="2.5" fill="#FFD93D" />
          <circle cx="47" cy="47" r="2.5" fill="#7BC74D" />
          {/* Spoon */}
          <rect x="60" y="22" width="4" height="22" rx="2" fill="#C0C0C0" />
          <ellipse cx="62" cy="22" rx="5" ry="7" fill="#D8D8D8" stroke="#C0C0C0" strokeWidth="1" />
        </g>
      );

    case "wash-face":
      return (
        <g>
          {/* Soap bar */}
          <rect x="18" y="28" width="44" height="30" rx="10" fill="#A8E6CF" stroke="#7BC4A8" strokeWidth="2" />
          {/* Soap shine */}
          <ellipse cx="30" cy="36" rx="6" ry="3" fill="white" opacity="0.5" transform="rotate(-20 30 36)" />
          {/* Bubbles */}
          <circle cx="58" cy="24" r="6" fill="white" stroke="#A8E6CF" strokeWidth="1.5" opacity="0.9" />
          <circle cx="68" cy="32" r="4" fill="white" stroke="#A8E6CF" strokeWidth="1.5" opacity="0.9" />
          <circle cx="62" cy="38" r="3" fill="white" stroke="#A8E6CF" strokeWidth="1.5" opacity="0.9" />
          <circle cx="50" cy="20" r="5" fill="white" stroke="#A8E6CF" strokeWidth="1.5" opacity="0.9" />
          {/* Lines on soap */}
          <text x="27" y="50" fontSize="10" fill="#7BC4A8" fontFamily="Fredoka" fontWeight="600">SOAP</text>
        </g>
      );

    case "potty-morning":
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

    case "put-on-shoes":
      return (
        <g>
          {/* Sneaker sole */}
          <ellipse cx="40" cy="58" rx="28" ry="8" fill="#9B8FE8" />
          {/* Shoe body */}
          <path d="M12 55 Q12 35 28 32 L55 32 Q68 32 68 45 L68 55 Z" fill="#C4B5FD" />
          {/* Toe cap */}
          <path d="M12 55 Q12 42 24 38 L35 36 Q22 40 18 55 Z" fill="#A78BFA" />
          {/* Tongue */}
          <rect x="34" y="30" width="16" height="16" rx="4" fill="#DDD6FE" />
          {/* Laces */}
          <line x1="36" y1="34" x2="48" y2="36" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="36" y1="38" x2="48" y2="40" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="36" y1="42" x2="48" y2="44" stroke="white" strokeWidth="2" strokeLinecap="round" />
          {/* Sole stripe */}
          <path d="M13 57 Q40 65 67 57" fill="none" stroke="white" strokeWidth="2" opacity="0.5" />
        </g>
      );

    case "brush-hair":
      return (
        <g>
          {/* Brush handle */}
          <rect x="10" y="42" width="38" height="14" rx="7" fill="#FF9FF3" stroke="#FF6BE8" strokeWidth="1.5" />
          {/* Brush head */}
          <rect x="44" y="30" width="24" height="28" rx="5" fill="#FFD6FB" stroke="#FF9FF3" strokeWidth="1.5" />
          {/* Bristles */}
          <line x1="49" y1="36" x2="49" y2="52" stroke="#FF9FF3" strokeWidth="2" strokeLinecap="round" />
          <line x1="54" y1="35" x2="54" y2="53" stroke="#FF9FF3" strokeWidth="2" strokeLinecap="round" />
          <line x1="59" y1="35" x2="59" y2="53" stroke="#FF9FF3" strokeWidth="2" strokeLinecap="round" />
          <line x1="64" y1="36" x2="64" y2="52" stroke="#FF9FF3" strokeWidth="2" strokeLinecap="round" />
          {/* Sparkle */}
          <text x="14" y="32" fontSize="14">✨</text>
        </g>
      );

    case "pack-bag":
      return (
        <g>
          {/* Backpack body */}
          <rect x="16" y="22" width="48" height="46" rx="10" fill="#7BC74D" stroke="#5DA832" strokeWidth="2" />
          {/* Top handle */}
          <path d="M32 22 Q32 14 40 14 Q48 14 48 22" fill="none" stroke="#5DA832" strokeWidth="3" strokeLinecap="round" />
          {/* Front pocket */}
          <rect x="22" y="40" width="36" height="22" rx="6" fill="#5DA832" />
          {/* Pocket zipper */}
          <line x1="25" y1="40" x2="55" y2="40" stroke="#FFD93D" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="55" cy="40" r="3" fill="#FFD93D" />
          {/* Main zipper */}
          <line x1="20" y1="30" x2="60" y2="30" stroke="#FFD93D" strokeWidth="2" strokeLinecap="round" />
          <circle cx="60" cy="30" r="2.5" fill="#FFD93D" />
          {/* Straps */}
          <rect x="24" y="22" width="6" height="30" rx="3" fill="#5DA832" opacity="0.6" />
          <rect x="50" y="22" width="6" height="30" rx="3" fill="#5DA832" opacity="0.6" />
        </g>
      );

    case "brush-teeth-morning":
      return (
        <g>
          {/* Toothbrush handle */}
          <rect x="15" y="35" width="45" height="10" rx="5" fill="#9B8FE8" />
          <rect x="15" y="35" width="15" height="10" rx="5" fill="#7B6FC8" />
          {/* Bristles */}
          <rect x="55" y="30" width="15" height="20" rx="3" fill="white" stroke="#E0E0E0" strokeWidth="1" />
          {/* Bristle lines */}
          <line x1="58" y1="33" x2="58" y2="47" stroke="#C4B5FD" strokeWidth="1.5" />
          <line x1="62" y1="33" x2="62" y2="47" stroke="#C4B5FD" strokeWidth="1.5" />
          <line x1="66" y1="33" x2="66" y2="47" stroke="#C4B5FD" strokeWidth="1.5" />
          {/* Sparkle */}
          <text x="60" y="22" fontSize="14">✨</text>
        </g>
      );

    case "wake-up":
      return (
        <g>
          {/* T-shirt */}
          <path d="M20 30 L12 20 L28 18 L40 26 L52 18 L68 20 L60 30 L60 65 L20 65 Z" fill="#FFB347" stroke="#E8941A" strokeWidth="1.5" />
          {/* Collar */}
          <path d="M28 18 Q40 28 52 18" fill="#E8941A" stroke="#E8941A" strokeWidth="1" />
          {/* Stripes */}
          <line x1="20" y1="40" x2="60" y2="40" stroke="#E8941A" strokeWidth="2" opacity="0.4" />
          <line x1="20" y1="50" x2="60" y2="50" stroke="#E8941A" strokeWidth="2" opacity="0.4" />
        </g>
      );

    case "unpack-bag":
      return (
        <g>
          {/* Backpack body — orange theme */}
          <rect x="16" y="22" width="48" height="46" rx="10" fill="#FFB347" stroke="#E8941A" strokeWidth="2" />
          {/* Top handle */}
          <path d="M32 22 Q32 14 40 14 Q48 14 48 22" fill="none" stroke="#E8941A" strokeWidth="3" strokeLinecap="round" />
          {/* Front pocket */}
          <rect x="22" y="40" width="36" height="22" rx="6" fill="#E8941A" />
          {/* Pocket zipper */}
          <line x1="25" y1="40" x2="55" y2="40" stroke="#FFD93D" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="55" cy="40" r="3" fill="#FFD93D" />
          {/* Main zipper — open */}
          <line x1="20" y1="30" x2="60" y2="30" stroke="#FFD93D" strokeWidth="2" strokeLinecap="round" />
          <circle cx="20" cy="30" r="2.5" fill="#FFD93D" />
          {/* Straps */}
          <rect x="24" y="22" width="6" height="30" rx="3" fill="#E8941A" opacity="0.6" />
          <rect x="50" y="22" width="6" height="30" rx="3" fill="#E8941A" opacity="0.6" />
        </g>
      );

    case "have-snack":
      return (
        <g>
          {/* Apple */}
          <path d="M40 18 Q56 18 60 34 Q64 50 52 60 Q46 65 40 65 Q34 65 28 60 Q16 50 20 34 Q24 18 40 18 Z" fill="#FF6B6B" />
          {/* Highlight */}
          <ellipse cx="32" cy="28" rx="5" ry="8" fill="white" opacity="0.25" transform="rotate(-20 32 28)" />
          {/* Stem */}
          <rect x="38" y="10" width="4" height="10" rx="2" fill="#5DA832" />
          {/* Leaf */}
          <path d="M42 14 Q52 8 54 16 Q48 18 42 14 Z" fill="#7BC74D" />
        </g>
      );

    case "reading":
      return (
        <g>
          {/* Book cover */}
          <rect x="14" y="15" width="52" height="50" rx="4" fill="#9B8FE8" />
          {/* Book spine */}
          <rect x="14" y="15" width="8" height="50" rx="2" fill="#7B6FC8" />
          {/* Pages */}
          <rect x="22" y="18" width="40" height="44" rx="2" fill="#FFF5E6" />
          {/* Text lines */}
          <rect x="28" y="28" width="28" height="3" rx="1.5" fill="#C4B5FD" />
          <rect x="28" y="35" width="22" height="3" rx="1.5" fill="#C4B5FD" />
          <rect x="28" y="42" width="26" height="3" rx="1.5" fill="#C4B5FD" />
          <rect x="28" y="49" width="18" height="3" rx="1.5" fill="#C4B5FD" />
          {/* Star */}
          <text x="34" y="64" fontSize="12">⭐</text>
        </g>
      );

    case "homework":
      return (
        <g>
          {/* Paper */}
          <rect x="18" y="12" width="44" height="56" rx="4" fill="white" stroke="#E0E0E0" strokeWidth="1.5" />
          {/* Lines */}
          <line x1="26" y1="26" x2="54" y2="26" stroke="#B0E0FF" strokeWidth="1.5" />
          <line x1="26" y1="34" x2="54" y2="34" stroke="#B0E0FF" strokeWidth="1.5" />
          <line x1="26" y1="42" x2="54" y2="42" stroke="#B0E0FF" strokeWidth="1.5" />
          <line x1="26" y1="50" x2="54" y2="50" stroke="#B0E0FF" strokeWidth="1.5" />
          {/* Pencil */}
          <rect x="52" y="8" width="8" height="36" rx="2" fill="#FFD93D" transform="rotate(30 56 26)" />
          <polygon points="56,8 60,8 58,2" fill="#FF6B6B" transform="rotate(30 56 26)" />
          <rect x="52" y="40" width="8" height="5" rx="0" fill="#E8A0A0" transform="rotate(30 56 26)" />
          {/* Sparkle */}
          <text x="20" y="64" fontSize="12">✨</text>
        </g>
      );

    case "pack-bag-homework":
      return (
        <g>
          {/* Stack of books */}
          <rect x="12" y="44" width="52" height="14" rx="4" fill="#FF6B6B" stroke="#E55555" strokeWidth="1.5" />
          <rect x="16" y="32" width="48" height="14" rx="4" fill="#9B8FE8" stroke="#7B6FC8" strokeWidth="1.5" />
          <rect x="20" y="20" width="44" height="14" rx="4" fill="#5BC0EB" stroke="#3DA8D3" strokeWidth="1.5" />
          {/* Book spines */}
          <rect x="12" y="44" width="6" height="14" rx="2" fill="#E55555" />
          <rect x="16" y="32" width="6" height="14" rx="2" fill="#7B6FC8" />
          <rect x="20" y="20" width="6" height="14" rx="2" fill="#3DA8D3" />
          {/* Sparkle */}
          <text x="54" y="18" fontSize="12">✨</text>
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
