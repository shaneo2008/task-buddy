import { useEffect, useState, useCallback } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import PixelRexCharacter from '../components/rex/PixelRexCharacter';
import { useRoutineStore } from '../store/useRoutineStore';
import { readShownRewards, markRewardShownLocal } from '../store/localStore';
import DEFAULT_REWARDS from '../data/rewards.json';

const CONFETTI_COLORS = ['#D4764E', '#E8A26B', '#8A9561', '#6FB9D8', '#9B8FE8', '#D8C27A', '#C78FB5', '#7D9BCF'];
const CONFETTI_SHAPES = ['●', '■', '▲', '★', '♦', '❤'];
const MotionDiv = Motion.div;
const MotionH1 = Motion.h1;
const MotionP = Motion.p;
const MotionSpan = Motion.span;

function generateConfetti(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    shape: CONFETTI_SHAPES[Math.floor(Math.random() * CONFETTI_SHAPES.length)],
    delay: Math.random() * 0.8,
    duration: 2 + Math.random() * 2,
    rotation: Math.random() * 720 - 360,
    size: 10 + Math.random() * 14,
  }));
}

/**
 * Shuffle bag: pick a reward that hasn't been shown in the current cycle
 * (no entry in shownMap, or oldest last_shown_at if all have been shown).
 */
function pickRewardFromBag(rewards, shownMap) {
  if (!rewards || rewards.length === 0) return null;
  const unshown = rewards.filter((r) => !shownMap[r.id]);
  if (unshown.length > 0) {
    return unshown[Math.floor(Math.random() * unshown.length)];
  }
  // All shown — reset cycle: pick from the oldest shown
  const sorted = [...rewards].sort(
    (a, b) => new Date(shownMap[a.id] || 0) - new Date(shownMap[b.id] || 0),
  );
  return sorted[0];
}

export default function RoutineComplete() {
  const { tasks, resetRoutine, selectedCharacter, routineName } = useRoutineStore();
  const [confetti, setConfetti] = useState([]);
  const [showContent, setShowContent] = useState(false);

  // Reward state
  const [rewards, setRewards] = useState([]);
  const [rewardsEnabled, setRewardsEnabled] = useState(true);
  const [pickedReward, setPickedReward] = useState(null);
  const [chestState, setChestState] = useState('hidden'); // hidden | closed | opening | revealed

  const characterName = selectedCharacter.charAt(0).toUpperCase() + selectedCharacter.slice(1);
  const totalMinutes = tasks.reduce((sum, t) => sum + t.durationMinutes, 0);

  // Load rewards from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('taskbuddy_rewards');
    if (saved) {
      try {
        setRewards(JSON.parse(saved));
      } catch {
        setRewards(DEFAULT_REWARDS);
      }
    } else {
      setRewards(DEFAULT_REWARDS);
    }
    
    const enabledSetting = localStorage.getItem('taskbuddy_rewards_enabled');
    if (enabledSetting !== null) {
      setRewardsEnabled(enabledSetting === 'true');
    }
  }, []);

  // Pick a reward once rewards are loaded, biased toward unshown.
  useEffect(() => {
    if (!rewardsEnabled || rewards.length === 0) return;
    const reward = pickRewardFromBag(rewards, readShownRewards());
    setPickedReward(reward);
  }, [rewards, rewardsEnabled]);

  const openChest = useCallback(() => {
    if (chestState !== 'closed' || !pickedReward) return;
    setChestState('opening');
    markRewardShownLocal(pickedReward.id);
    setTimeout(() => setChestState('revealed'), 800);
  }, [chestState, pickedReward]);

  useEffect(() => {
    setConfetti(generateConfetti(40));
    const timer = setTimeout(() => setShowContent(true), 600);
    // Show chest after a delay if rewards enabled
    const chestTimer = setTimeout(() => {
      if (rewardsEnabled && pickedReward && rewards.length > 0) setChestState('closed');
    }, 2000);
    return () => { clearTimeout(timer); clearTimeout(chestTimer); };
  }, [rewardsEnabled, pickedReward, rewards]);

  return (
    <div data-buddy-scroll="true" className="w-full h-full min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain px-4 pt-3 pb-6 relative text-cocoa-text sm:pt-5 sm:pb-8" style={{ background: 'linear-gradient(180deg, #FFF9E6 0%, #FFF0C8 40%, #FDEAB8 100%)' }}>
      {/* Confetti Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confetti.map((piece) => (
          <MotionDiv
            key={piece.id}
            className="absolute"
            style={{ left: `${piece.x}%`, top: -20, fontSize: piece.size, color: piece.color }}
            initial={{ y: -30, opacity: 1, rotate: 0 }}
            animate={{ y: window.innerHeight + 50, opacity: [1, 1, 0.8, 0], rotate: piece.rotation }}
            transition={{ duration: piece.duration, delay: piece.delay, ease: 'easeOut', repeat: Infinity, repeatDelay: 1 }}
          >
            {piece.shape}
          </MotionDiv>
        ))}
      </div>

      {showContent && (
        <MotionDiv
          className="w-full max-w-sm mx-auto flex flex-col items-center z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <div className="hidden items-center gap-2 rounded-full border border-cocoa-300/15 bg-white/50/88 px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-cocoa-50/65 font-body shadow-sm backdrop-blur-md mb-4 sm:inline-flex">
            <span>Routine Complete</span>
            <span className="text-cocoa-text">{routineName}</span>
          </div>
          <MotionH1
            className="font-display text-[2rem] sm:text-4xl font-bold text-cocoa-text text-center mb-1.5 sm:mb-2"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            🎉 All Done! 🎉
          </MotionH1>

          <MotionP
            className="text-cocoa-100/80 font-body font-semibold text-center mb-4 leading-relaxed sm:mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {characterName} is so happy! You completed all {tasks.length} tasks!
          </MotionP>

          <MotionDiv
            className="relative"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            <div className="absolute inset-4 rounded-full bg-peach-accent/10 blur-3xl pointer-events-none" />
            <div className="relative rounded-[32px] border border-cocoa-300/15 bg-white/40 px-6 py-5 sm:px-8 sm:py-7 shadow-lg backdrop-blur-md overflow-hidden">
              <div className="absolute inset-x-10 top-4 h-16 rounded-full bg-white/[0.04] blur-2xl pointer-events-none" />
            <PixelRexCharacter state="celebrating" size={148} characterId={selectedCharacter} />
            </div>
          </MotionDiv>

          {/* Treasure Chest Reward */}
          <AnimatePresence>
            {chestState !== 'hidden' && (
              <MotionDiv
                className="w-full max-w-xs mx-auto my-4"
                initial={{ opacity: 0, scale: 0.6, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              >
                {chestState === 'closed' && (
                  <button
                    onClick={openChest}
                    className="w-full flex flex-col items-center gap-2 p-5 rounded-[28px] border-2 border-peach-accent/40 bg-white/60 shadow-lg hover:border-peach-accent/70 hover:scale-[1.02] transition-all active:scale-95 backdrop-blur-md"
                  >
                    <MotionDiv
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                      className="text-5xl"
                    >
                      🎁
                    </MotionDiv>
                    <span className="font-display font-bold text-sm text-peach-300">Tap to open your reward!</span>
                  </button>
                )}

                {chestState === 'opening' && (
                  <div className="w-full flex flex-col items-center gap-2 p-5 rounded-[28px] border-2 border-peach-accent/40 bg-white/60 shadow-lg backdrop-blur-md">
                    <MotionDiv
                      animate={{ rotate: [-5, 5, -5, 5, 0], scale: [1, 1.15, 1.1, 1.2, 1.3] }}
                      transition={{ duration: 0.8 }}
                      className="text-5xl"
                    >
                      🎁
                    </MotionDiv>
                    <span className="font-display font-bold text-sm text-peach-300 animate-pulse">Opening...</span>
                  </div>
                )}

                {chestState === 'revealed' && pickedReward && (
                  <MotionDiv
                    className="w-full flex flex-col items-center gap-3 p-5 rounded-[28px] border-2 border-peach-accent/50 bg-white/70 shadow-lg backdrop-blur-md"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 250 }}
                  >
                    <MotionDiv
                      className="text-4xl"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                    >
                      🌟
                    </MotionDiv>
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-peach-300 font-body mb-1">Your Reward</p>
                      <p className="font-display font-black text-2xl text-cocoa-text leading-snug text-center">{pickedReward.text}</p>
                    </div>
                  </MotionDiv>
                )}
              </MotionDiv>
            )}
          </AnimatePresence>

          <MotionDiv
            className="flex flex-col gap-3 w-full mt-4 mb-4 sm:max-w-xs sm:mt-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42 }}
          >
            <button onClick={resetRoutine} className="btn-primary w-full">
              🔄 Start Over
            </button>
          </MotionDiv>

          <MotionDiv
            className="grid grid-cols-3 gap-2 w-full mt-1 mb-1 sm:max-w-xs"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <div className="rounded-2xl border border-cocoa-300/15 bg-white/50/82 px-3 py-2 text-center">
              <div className="text-[10px] uppercase tracking-[0.14em] text-cocoa-50/55 font-body">Tasks</div>
              <div className="text-sm font-display font-semibold text-cocoa-text mt-1">{tasks.length}</div>
            </div>
            <div className="rounded-2xl border border-cocoa-300/15 bg-white/50/82 px-3 py-2 text-center">
              <div className="text-[10px] uppercase tracking-[0.14em] text-cocoa-50/55 font-body">Time</div>
              <div className="text-sm font-display font-semibold text-cocoa-text mt-1">{totalMinutes} min</div>
            </div>
            <div className="rounded-2xl border border-cocoa-300/15 bg-white/50/82 px-3 py-2 text-center">
              <div className="text-[10px] uppercase tracking-[0.14em] text-cocoa-50/55 font-body">Buddy</div>
              <div className="text-sm font-display font-semibold text-cocoa-text mt-1">{characterName}</div>
            </div>
          </MotionDiv>

          <MotionDiv
            className="glass-card-solid w-full p-4 mt-5 mb-4 text-cocoa-text sm:max-w-xs sm:mt-6 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="font-display text-sm font-bold text-cocoa-100/80 mb-3 text-center">Completed Tasks</h3>
            <div className="space-y-2">
              {tasks.map((task, i) => (
                <MotionDiv
                  key={task.id}
                  className="flex items-center gap-2 py-2 px-3 rounded-2xl bg-white/60/78 border border-white/8"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  <MotionSpan className="text-lg" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 + i * 0.1, type: 'spring' }}>
                    ✅
                  </MotionSpan>
                  <span className="font-display font-semibold text-sm flex-1 text-cocoa-text">{task.title}</span>
                  <span className="text-xs text-cocoa-50/65 font-body">{task.durationMinutes}m</span>
                </MotionDiv>
              ))}
            </div>
            <div className="mt-3 text-center">
              <span className="font-display font-bold text-sm" style={{ color: '#8A9561' }}>
                Total: {totalMinutes} minutes
              </span>
            </div>
          </MotionDiv>
        </MotionDiv>
      )}
    </div>
  );
}
