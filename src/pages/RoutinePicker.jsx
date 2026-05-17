import { motion, AnimatePresence } from 'framer-motion';
import { useRoutineStore } from '../store/useRoutineStore';
import Logo from '../components/Logo';

const MotionButton = motion.button;

const ROUTINES = [
  { type: 'bedtime',  emoji: '🌙', label: 'Bedtime',  description: 'Wind down & get ready for sleep', color: '#A593F7', tint: 'rgba(165, 147, 247, 0.12)' },
  { type: 'morning',  emoji: '🌅', label: 'Morning',  description: 'Start the day the right way',     color: '#E8A26B', tint: 'rgba(232, 162, 107, 0.12)' },
  { type: 'homework', emoji: '📚', label: 'Homework', description: 'Focus up & get it done',          color: '#6FB9D8', tint: 'rgba(111, 185, 216, 0.12)' },
  { type: 'custom',   emoji: '✏️', label: 'Custom',   description: 'Create your own routine',          color: '#7FC56A', tint: 'rgba(127, 197, 106, 0.12)' },
];

export default function RoutinePicker() {
  const { setRoutine, setScreen } = useRoutineStore();
  const routineCount = ROUTINES.length;

  const handleSelect = (type) => {
    if (type === 'custom') {
      setScreen('customList');
    } else {
      setRoutine(type);
    }
  };

  return (
    <div className="h-full min-h-full flex flex-col px-1 py-1 text-cocoa-text overflow-hidden sm:py-2">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 shrink-0 sm:mb-5">
        <button
          onClick={() => setScreen('selection')}
          className="w-10 h-10 rounded-2xl bg-white/60 border border-cocoa-300/15 flex items-center justify-center text-cocoa-100 hover:text-cocoa-text hover:bg-white/80 transition-colors backdrop-blur-sm shadow-sm"
        >
          <span className="text-sm">←</span>
        </button>
        <Logo className="h-8 w-auto" size="small" />
      </div>

      {/* Title */}
      <div className="text-center mb-4 px-2 shrink-0 sm:mb-6 sm:px-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-cocoa-300/15 bg-white/50 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-cocoa-50 font-body shadow-sm backdrop-blur-md mb-2 sm:py-1.5 sm:text-[11px] sm:mb-4">
          <span>Routine Menu</span>
          <span className="text-cocoa-text">{routineCount} paths</span>
        </div>
        <h1 className="text-[1.6rem] leading-tight font-display font-bold text-cocoa-text mb-1 sm:text-3xl sm:mb-2">Choose a Routine</h1>
        <p className="text-cocoa-100 text-[13px] font-body leading-snug sm:text-sm sm:leading-normal">What are we doing today?</p>
      </div>

      {/* Routine Tiles */}
      <div className="relative w-full max-w-sm mx-auto flex-1 min-h-0 mb-2 flex items-center sm:mb-4">
        <div className="absolute inset-8 rounded-full bg-peach-accent/15 blur-3xl pointer-events-none" />
        <div className="relative w-full rounded-[32px] border border-cocoa-300/15 bg-white/40 px-3 py-4 sm:px-4 sm:py-5 shadow-lg backdrop-blur-md overflow-hidden">
          <div className="absolute inset-x-10 top-4 h-16 rounded-full bg-peach-100/20 blur-2xl pointer-events-none" />
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
        {ROUTINES.map((routine, i) => (
          <MotionButton
            key={routine.type}
            onClick={() => handleSelect(routine.type)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex flex-col items-center px-3 py-3 rounded-[24px] shadow-md border transition-all min-h-[128px] justify-center sm:p-5 sm:rounded-[28px] sm:min-h-[170px]"
            style={{ backgroundColor: routine.tint, borderColor: `${routine.color}40`, boxShadow: `0 8px 20px -12px ${routine.color}55` }}
          >
            <div className="mb-1 text-[9px] uppercase tracking-[0.14em] text-cocoa-50 font-body sm:mb-2 sm:text-[10px]">Guided flow</div>
            <div className="w-11 h-11 rounded-[16px] flex items-center justify-center mb-1.5 border border-cocoa-300/15 bg-white/50 text-[1.45rem] sm:w-14 sm:h-14 sm:rounded-2xl sm:mb-3 sm:text-3xl">
              <span>{routine.emoji}</span>
            </div>
            <span className="font-display font-semibold text-cocoa-text text-[1rem] mb-0.5 sm:text-xl sm:mb-1">{routine.label}</span>
            <span className="text-[12px] text-cocoa-100 text-center leading-snug font-body sm:text-sm sm:leading-tight">{routine.description}</span>
          </MotionButton>
        ))}
          </div>
        </div>
      </div>

      <div className="max-w-sm mx-auto rounded-[24px] border border-cocoa-300/15 bg-white/50 px-3 py-2 shadow-sm backdrop-blur-md text-center shrink-0 sm:px-4 sm:py-3">
        <p className="text-cocoa-100 text-[12px] font-body leading-snug sm:text-sm sm:leading-relaxed">Choose a ready-made path or create your own if tonight needs something specific.</p>
      </div>

    </div>
  );
}
