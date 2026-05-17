import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';

/**
 * Maps legacy task IDs (from useRoutineStore) to svgGroup keys.
 * New code should pass svgGroup directly.
 */
const LEGACY_ID_TO_SVG_GROUP = {
  'pajamas': 'clothes',
  'brush-teeth': 'toothbrush',
  'brush-teeth-morning': 'toothbrush',
  'potty': 'toilet-roll',
  'potty-morning': 'toilet-roll',
  'pick-book': 'book',
  'reading': 'book',
  'lights-off': 'moon',
  'eat-breakfast': 'bowl',
  'wash-face': 'soap',
  'put-on-shoes': 'shoe',
  'brush-hair': 'hairbrush',
  'pack-bag': 'backpack',
  'unpack-bag': 'backpack',
  'pack-bag-homework': 'backpack',
  'wake-up': 'clothes',
  'have-snack': 'apple',
  'homework': 'pencil',
};

export default function TaskItemSVG({ itemId, svgGroup, isFlying, isHidden, className = '' }) {
  const ref = useRef(null);
  const resolvedGroup = svgGroup || LEGACY_ID_TO_SVG_GROUP[itemId] || 'question-mark';

  useEffect(() => {
    if (isFlying && ref.current) {
      ref.current.style.transform = 'translate(-40px, 80px) scale(0.3) rotate(-30deg)';
    }
  }, [isFlying]);

  if (isHidden) return null;

  return (
    <div
      ref={ref}
      className={`item-fly-to-mouth ${className}`}
      style={{ transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: isHidden ? 0 : 1 }}
    >
      <motion.div
        animate={!isFlying ? { y: [0, -6, 0], rotate: [0, 3, -3, 0] } : {}}
        transition={!isFlying ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } : {}}
      >
        <svg viewBox="0 0 80 80" width="64" height="64" className="drop-shadow-md">
          {renderSvgGroup(resolvedGroup)}
        </svg>
      </motion.div>
    </div>
  );
}

function renderSvgGroup(group) {
  switch (group) {
    // ── Existing assets ──
    case 'toothbrush':
      return (<g><rect x="15" y="35" width="45" height="10" rx="5" fill="#5BC0EB" /><rect x="15" y="35" width="15" height="10" rx="5" fill="#3DA8D3" /><rect x="55" y="30" width="15" height="20" rx="3" fill="white" stroke="#E0E0E0" strokeWidth="1" /><line x1="58" y1="33" x2="58" y2="47" stroke="#B0E0FF" strokeWidth="1.5" /><line x1="62" y1="33" x2="62" y2="47" stroke="#B0E0FF" strokeWidth="1.5" /><line x1="66" y1="33" x2="66" y2="47" stroke="#B0E0FF" strokeWidth="1.5" /><text x="60" y="22" fontSize="14">✨</text></g>);
    case 'clothes':
      return (<g><rect x="12" y="20" width="56" height="45" rx="8" fill="#C4B5FD" /><rect x="16" y="24" width="48" height="37" rx="6" fill="#DDD6FE" /><path d="M28 24 L40 32 L52 24" fill="#C4B5FD" stroke="#A78BFA" strokeWidth="1" /><text x="25" y="50" fontSize="12">⭐</text><text x="45" y="45" fontSize="10">⭐</text><text x="35" y="58" fontSize="8">✨</text><rect x="8" y="30" width="12" height="20" rx="5" fill="#C4B5FD" /><rect x="60" y="30" width="12" height="20" rx="5" fill="#C4B5FD" /></g>);
    case 'toilet-roll':
      return (<g><ellipse cx="40" cy="40" rx="22" ry="22" fill="white" stroke="#E8DCC8" strokeWidth="2" /><ellipse cx="40" cy="40" rx="8" ry="8" fill="#F5F0E8" stroke="#E8DCC8" strokeWidth="1.5" /><path d="M62 40 Q70 40 70 50 Q70 60 60 62 Q50 64 48 58" fill="none" stroke="white" strokeWidth="6" /><path d="M62 40 Q70 40 70 50 Q70 60 60 62 Q50 64 48 58" fill="none" stroke="#E8DCC8" strokeWidth="1.5" /><circle cx="34" cy="37" r="2" fill="#8B6D4E" /><circle cx="46" cy="37" r="2" fill="#8B6D4E" /><path d="M36 44 Q40 48 44 44" stroke="#8B6D4E" strokeWidth="1.5" fill="none" strokeLinecap="round" /></g>);
    case 'book':
      return (<g><rect x="14" y="15" width="52" height="50" rx="4" fill="#9B8FE8" /><rect x="14" y="15" width="8" height="50" rx="2" fill="#7B6FC8" /><rect x="22" y="18" width="40" height="44" rx="2" fill="#FFF5E6" /><rect x="28" y="30" width="28" height="3" rx="1.5" fill="#C4B5FD" /><rect x="28" y="38" width="20" height="3" rx="1.5" fill="#C4B5FD" /><text x="34" y="56" fontSize="14">⭐</text></g>);
    case 'bowl':
      return (<g><ellipse cx="40" cy="50" rx="26" ry="10" fill="#FFB347" /><path d="M14 45 Q14 62 40 62 Q66 62 66 45 Z" fill="#FFCF87" /><ellipse cx="40" cy="45" rx="26" ry="10" fill="#FFE4B2" stroke="#FFB347" strokeWidth="2" /><circle cx="33" cy="43" r="3" fill="#FF6B6B" /><circle cx="42" cy="41" r="3" fill="#7BC74D" /><circle cx="50" cy="44" r="3" fill="#FF6B6B" /><circle cx="38" cy="47" r="2.5" fill="#FFD93D" /><circle cx="47" cy="47" r="2.5" fill="#7BC74D" /><rect x="60" y="22" width="4" height="22" rx="2" fill="#C0C0C0" /><ellipse cx="62" cy="22" rx="5" ry="7" fill="#D8D8D8" stroke="#C0C0C0" strokeWidth="1" /></g>);
    case 'soap':
      return (<g><rect x="18" y="28" width="44" height="30" rx="10" fill="#A8E6CF" stroke="#7BC4A8" strokeWidth="2" /><ellipse cx="30" cy="36" rx="6" ry="3" fill="white" opacity="0.5" transform="rotate(-20 30 36)" /><circle cx="58" cy="24" r="6" fill="white" stroke="#A8E6CF" strokeWidth="1.5" opacity="0.9" /><circle cx="68" cy="32" r="4" fill="white" stroke="#A8E6CF" strokeWidth="1.5" opacity="0.9" /><circle cx="62" cy="38" r="3" fill="white" stroke="#A8E6CF" strokeWidth="1.5" opacity="0.9" /><circle cx="50" cy="20" r="5" fill="white" stroke="#A8E6CF" strokeWidth="1.5" opacity="0.9" /></g>);
    case 'shoe':
      return (<g><ellipse cx="40" cy="58" rx="28" ry="8" fill="#9B8FE8" /><path d="M12 55 Q12 35 28 32 L55 32 Q68 32 68 45 L68 55 Z" fill="#C4B5FD" /><path d="M12 55 Q12 42 24 38 L35 36 Q22 40 18 55 Z" fill="#A78BFA" /><rect x="34" y="30" width="16" height="16" rx="4" fill="#DDD6FE" /><line x1="36" y1="34" x2="48" y2="36" stroke="white" strokeWidth="2" strokeLinecap="round" /><line x1="36" y1="38" x2="48" y2="40" stroke="white" strokeWidth="2" strokeLinecap="round" /><line x1="36" y1="42" x2="48" y2="44" stroke="white" strokeWidth="2" strokeLinecap="round" /></g>);
    case 'hairbrush':
      return (<g><rect x="10" y="42" width="38" height="14" rx="7" fill="#FF9FF3" stroke="#FF6BE8" strokeWidth="1.5" /><rect x="44" y="30" width="24" height="28" rx="5" fill="#FFD6FB" stroke="#FF9FF3" strokeWidth="1.5" /><line x1="49" y1="36" x2="49" y2="52" stroke="#FF9FF3" strokeWidth="2" strokeLinecap="round" /><line x1="54" y1="35" x2="54" y2="53" stroke="#FF9FF3" strokeWidth="2" strokeLinecap="round" /><line x1="59" y1="35" x2="59" y2="53" stroke="#FF9FF3" strokeWidth="2" strokeLinecap="round" /><line x1="64" y1="36" x2="64" y2="52" stroke="#FF9FF3" strokeWidth="2" strokeLinecap="round" /><text x="14" y="32" fontSize="14">✨</text></g>);
    case 'backpack':
      return (<g><rect x="16" y="22" width="48" height="46" rx="10" fill="#7BC74D" stroke="#5DA832" strokeWidth="2" /><path d="M32 22 Q32 14 40 14 Q48 14 48 22" fill="none" stroke="#5DA832" strokeWidth="3" strokeLinecap="round" /><rect x="22" y="40" width="36" height="22" rx="6" fill="#5DA832" /><line x1="25" y1="40" x2="55" y2="40" stroke="#FFD93D" strokeWidth="2.5" strokeLinecap="round" /><circle cx="55" cy="40" r="3" fill="#FFD93D" /><line x1="20" y1="30" x2="60" y2="30" stroke="#FFD93D" strokeWidth="2" strokeLinecap="round" /><circle cx="60" cy="30" r="2.5" fill="#FFD93D" /></g>);
    case 'apple':
      return (<g><path d="M40 18 Q56 18 60 34 Q64 50 52 60 Q46 65 40 65 Q34 65 28 60 Q16 50 20 34 Q24 18 40 18 Z" fill="#FF6B6B" /><ellipse cx="32" cy="28" rx="5" ry="8" fill="white" opacity="0.25" transform="rotate(-20 32 28)" /><rect x="38" y="10" width="4" height="10" rx="2" fill="#5DA832" /><path d="M42 14 Q52 8 54 16 Q48 18 42 14 Z" fill="#7BC74D" /></g>);
    case 'pencil':
      return (<g><rect x="18" y="12" width="44" height="56" rx="4" fill="white" stroke="#E0E0E0" strokeWidth="1.5" /><line x1="26" y1="26" x2="54" y2="26" stroke="#B0E0FF" strokeWidth="1.5" /><line x1="26" y1="34" x2="54" y2="34" stroke="#B0E0FF" strokeWidth="1.5" /><line x1="26" y1="42" x2="54" y2="42" stroke="#B0E0FF" strokeWidth="1.5" /><line x1="26" y1="50" x2="54" y2="50" stroke="#B0E0FF" strokeWidth="1.5" /><text x="20" y="64" fontSize="12">✨</text></g>);

    // ── New assets ──
    case 'moon':
      return (<g><circle cx="40" cy="38" r="22" fill="#FFD93D" /><circle cx="50" cy="32" r="18" fill="#FFF9EE" /><text x="12" y="25" fontSize="10">⭐</text><text x="55" y="20" fontSize="8">✨</text><text x="60" y="55" fontSize="10">⭐</text><text x="15" y="60" fontSize="8">✨</text></g>);
    case 'glass':
      return (<g><path d="M24 20 L24 58 Q24 64 30 64 L50 64 Q56 64 56 58 L56 20 Z" fill="#D4F1F9" stroke="#7FCDEE" strokeWidth="2" /><path d="M24 20 L56 20" stroke="#7FCDEE" strokeWidth="2" strokeLinecap="round" /><ellipse cx="40" cy="44" rx="14" ry="4" fill="#A8E6F7" opacity="0.5" /><path d="M30 28 Q32 34 30 40" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" /><circle cx="48" cy="50" r="3" fill="white" opacity="0.4" /></g>);
    case 'pill':
      return (<g><rect x="14" y="32" width="52" height="20" rx="10" fill="#FF9FF3" /><rect x="40" y="32" width="26" height="20" rx="10" fill="#FFD6FB" /><line x1="40" y1="32" x2="40" y2="52" stroke="white" strokeWidth="1.5" opacity="0.6" /><ellipse cx="27" cy="38" rx="4" ry="2" fill="white" opacity="0.3" transform="rotate(-20 27 38)" /><text x="55" y="26" fontSize="10">✨</text><text x="14" y="28" fontSize="8">💊</text></g>);
    case 'pet-bowl':
      return (<g><ellipse cx="40" cy="55" rx="26" ry="8" fill="#8B6D4E" /><path d="M14 50 Q14 60 40 60 Q66 60 66 50 Z" fill="#A0845C" /><ellipse cx="40" cy="48" rx="26" ry="8" fill="#C4A06E" stroke="#8B6D4E" strokeWidth="2" /><circle cx="32" cy="46" r="3" fill="#6B4E2E" /><circle cx="40" cy="44" r="3.5" fill="#6B4E2E" /><circle cx="48" cy="46" r="3" fill="#6B4E2E" /><circle cx="36" cy="50" r="2.5" fill="#6B4E2E" /><circle cx="44" cy="50" r="2.5" fill="#6B4E2E" /><text x="54" y="36" fontSize="12">🐾</text></g>);
    case 'lips':
      return (<g><path d="M20 40 Q30 28 40 32 Q50 28 60 40 Q55 52 40 54 Q25 52 20 40 Z" fill="#FF6B8A" /><path d="M20 40 Q30 36 40 40 Q50 36 60 40" stroke="#E54B6B" strokeWidth="1.5" fill="none" /><ellipse cx="30" cy="37" rx="5" ry="3" fill="#FF8FA8" opacity="0.5" /><text x="28" y="26" fontSize="10">💬</text><text x="52" y="60" fontSize="8">✨</text></g>);
    case 'screen':
      return (<g><rect x="12" y="18" width="56" height="38" rx="4" fill="#2D3748" stroke="#4A5568" strokeWidth="2" /><rect x="16" y="22" width="48" height="30" rx="2" fill="#4C6EF5" /><rect x="30" y="58" width="20" height="4" rx="2" fill="#4A5568" /><rect x="24" y="62" width="32" height="3" rx="1.5" fill="#4A5568" /><line x1="32" y1="32" x2="32" y2="44" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.8" /><path d="M32 32 L44 38 L32 44 Z" fill="white" opacity="0.8" /><circle cx="56" cy="14" r="4" fill="#FF6B6B" opacity="0.9" /></g>);
    case 'hands':
      return (<g><path d="M30 55 Q30 35 35 30 Q37 28 39 30 L39 45" stroke="#FFD4A8" strokeWidth="5" fill="#FFE4C8" strokeLinecap="round" /><path d="M39 45 L39 25 Q41 22 43 25 L43 45" stroke="#FFD4A8" strokeWidth="5" fill="#FFE4C8" strokeLinecap="round" /><path d="M43 45 L43 27 Q45 24 47 27 L47 45" stroke="#FFD4A8" strokeWidth="5" fill="#FFE4C8" strokeLinecap="round" /><path d="M47 45 L47 30 Q49 28 51 30 L51 45" stroke="#FFD4A8" strokeWidth="4" fill="#FFE4C8" strokeLinecap="round" /><path d="M51 45 Q51 38 53 36 Q55 34 55 38 L55 45" stroke="#FFD4A8" strokeWidth="3.5" fill="#FFE4C8" strokeLinecap="round" /><ellipse cx="42" cy="52" rx="14" ry="8" fill="#FFE4C8" stroke="#FFD4A8" strokeWidth="2" /><text x="22" y="22" fontSize="10">✨</text><text x="56" y="22" fontSize="8">🙏</text></g>);
    case 'pillow':
      return (<g><ellipse cx="40" cy="42" rx="28" ry="18" fill="#E8D5F5" stroke="#C4A5E0" strokeWidth="2" /><ellipse cx="40" cy="40" rx="24" ry="14" fill="#F3E8FF" /><path d="M20 40 Q30 34 40 36 Q50 34 60 40" stroke="#D4B5F0" strokeWidth="1.5" fill="none" /><ellipse cx="30" cy="38" rx="6" ry="3" fill="white" opacity="0.3" transform="rotate(-10 30 38)" /><text x="50" y="30" fontSize="10">💤</text></g>);
    case 'broom':
      return (<g><rect x="38" y="10" width="4" height="40" rx="2" fill="#C89A63" stroke="#A0784A" strokeWidth="1" /><path d="M28 50 Q30 46 40 48 Q50 46 52 50 L54 68 Q40 72 26 68 Z" fill="#FFD93D" stroke="#E8B820" strokeWidth="1.5" /><line x1="32" y1="52" x2="30" y2="66" stroke="#E8B820" strokeWidth="1.5" strokeLinecap="round" /><line x1="36" y1="51" x2="35" y2="67" stroke="#E8B820" strokeWidth="1.5" strokeLinecap="round" /><line x1="40" y1="50" x2="40" y2="68" stroke="#E8B820" strokeWidth="1.5" strokeLinecap="round" /><line x1="44" y1="51" x2="45" y2="67" stroke="#E8B820" strokeWidth="1.5" strokeLinecap="round" /><line x1="48" y1="52" x2="50" y2="66" stroke="#E8B820" strokeWidth="1.5" strokeLinecap="round" /></g>);
    case 'toy':
      return (<g><circle cx="40" cy="38" r="20" fill="#C89A63" stroke="#A0784A" strokeWidth="2" /><circle cx="40" cy="38" r="14" fill="#E8C88A" /><circle cx="34" cy="34" r="3" fill="#2D1B0E" /><circle cx="46" cy="34" r="3" fill="#2D1B0E" /><ellipse cx="40" cy="40" rx="4" ry="3" fill="#2D1B0E" /><circle cx="34" cy="42" r="4" fill="#FF9F9F" opacity="0.5" /><circle cx="46" cy="42" r="4" fill="#FF9F9F" opacity="0.5" /><circle cx="40" cy="60" rx="12" ry="8" fill="#C89A63" stroke="#A0784A" strokeWidth="2" /><circle cx="28" cy="52" r="6" fill="#C89A63" stroke="#A0784A" strokeWidth="1.5" /><circle cx="52" cy="52" r="6" fill="#C89A63" stroke="#A0784A" strokeWidth="1.5" /></g>);

    // ── Fallback ──
    case 'question-mark':
    default:
      return (<g><circle cx="40" cy="40" r="20" fill="#E8DCC8" stroke="#C4B5A0" strokeWidth="2" /><text x="40" y="46" textAnchor="middle" fontSize="20" fill="#8B6D4E">?</text></g>);
  }
}
