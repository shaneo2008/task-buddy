import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PixelRexCharacter from '../components/rex/PixelRexCharacter';
import ProgressRing from '../components/rex/ProgressRing';
import TaskItemSVG from '../components/rex/TaskItemSVG';
import ParticleBurst from '../components/rex/ParticleBurst';
import { useRoutineStore } from '../store/useRoutineStore';

const MotionDiv = motion.div;
const MotionButton = motion.button;
const COMPLETED_TASK_COLOR = '#81906F';

export default function ActivePlayer() {
  const {
    tasks, currentTaskIndex, timeLeft, totalTime, rexState,
    feedRex, doneEarly, onEatComplete, skipTask,
    pauseRoutine, resumeRoutine, isRunning, selectedCharacter, routineName, cancelRoutine, tick,
  } = useRoutineStore();

  const currentTask = tasks[currentTaskIndex];
  const isHungry = rexState === 'hungry';
  const isBored = rexState === 'bored';
  const isIdle = rexState === 'idle';
  const isWaiting = isIdle || isBored;

  const characterName = selectedCharacter
    ? selectedCharacter.charAt(0).toUpperCase() + selectedCharacter.slice(1)
    : 'Rex';
  const tasksRemaining = Math.max(tasks.length - currentTaskIndex - 1, 0);
  const taskDurationLabel = currentTask?.durationMinutes ? `${currentTask.durationMinutes} min focus` : 'Quick step';

  const [eatPhase, setEatPhase] = useState('none');
  const [isItemFlying, setIsItemFlying] = useState(false);
  const [isItemHidden, setIsItemHidden] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [isEatingSequence, setIsEatingSequence] = useState(false);
  const [postChompCelebrating, setPostChompCelebrating] = useState(false);
  const timeoutsRef = useRef([]);

  useEffect(() => {
    return () => { timeoutsRef.current.forEach(clearTimeout); };
  }, []);

  useEffect(() => {
    setEatPhase('none');
    setIsItemFlying(false);
    setIsItemHidden(false);
    setShowParticles(false);
    setIsEatingSequence(false);
    setPostChompCelebrating(false);
  }, [currentTaskIndex]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const syncTimer = () => {
      if (document.visibilityState === 'visible') tick();
    };

    document.addEventListener('visibilitychange', syncTimer);
    window.addEventListener('focus', syncTimer);
    window.addEventListener('pageshow', syncTimer);

    return () => {
      document.removeEventListener('visibilitychange', syncTimer);
      window.removeEventListener('focus', syncTimer);
      window.removeEventListener('pageshow', syncTimer);
    };
  }, [tick]);

  const startEatingSequence = useCallback(() => {
    let wasAlreadyRunning = false;
    setIsEatingSequence((prev) => { wasAlreadyRunning = prev; return true; });
    if (wasAlreadyRunning) return;

    feedRex();
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    setIsItemFlying(true);
    timeoutsRef.current.push(setTimeout(() => setEatPhase('jaw-open'), 400));
    timeoutsRef.current.push(setTimeout(() => {
      setIsItemHidden(true);
      setEatPhase('chomp');
      setShowParticles(true);
    }, 600));
    timeoutsRef.current.push(setTimeout(() => {
      setShowParticles(false);
      setPostChompCelebrating(true);
    }, 1200));
    timeoutsRef.current.push(setTimeout(() => {
      setEatPhase('none');
      setIsItemFlying(false);
      setIsItemHidden(false);
      setIsEatingSequence(false);
      setPostChompCelebrating(false);
      onEatComplete();
    }, 3000));
  }, [feedRex, onEatComplete]);

  const handleFeed = useCallback(() => {
    if (!isHungry || isEatingSequence) return;
    startEatingSequence();
  }, [isHungry, isEatingSequence, startEatingSequence]);

  const handleDoneEarly = useCallback(() => {
    if (!isWaiting || isEatingSequence) return;
    doneEarly();
  }, [isWaiting, isEatingSequence, doneEarly]);

  const handleCancelRoutine = useCallback(() => {
    cancelRoutine();
  }, [cancelRoutine]);

  const instructionText = isEatingSequence
    ? `Reward moment for ${characterName}. Next step starts soon.`
    : isHungry
      ? `Tap feed to reward ${characterName} and unlock the next task.`
      : isRunning
        ? `${characterName} is waiting while you finish this step.`
        : 'Paused. Resume whenever you are ready.';

  return (
    <div className="h-full min-h-0 flex flex-col items-center px-3 pt-1.5 pb-3 sm:px-4 sm:pt-2 sm:pb-4 relative overflow-hidden text-cocoa-text">
      <div className="w-full max-w-sm min-h-0 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-2 z-10 shrink-0 sm:gap-3 sm:mb-3">
          <button
            onClick={handleCancelRoutine}
            className="w-10 h-10 rounded-2xl bg-white/50/88 border border-cocoa-300/15 flex items-center justify-center text-cocoa-text hover:text-cocoa-text hover:bg-white/60 transition-colors shrink-0"
          >
            <span className="text-sm">✕</span>
          </button>
          <div className="flex min-w-0 flex-1 justify-center">
            <div className="inline-flex min-w-0 max-w-full items-center gap-2 rounded-full border border-cocoa-300/15 bg-white/50/88 px-2.5 py-1.5 shadow-sm backdrop-blur-md sm:gap-3 sm:px-4 sm:py-2">
            <div className="flex gap-1.5 shrink-0 sm:gap-2">
              {tasks.map((task, i) => (
                <MotionDiv
                  key={task.id}
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: i < currentTaskIndex ? COMPLETED_TASK_COLOR : i === currentTaskIndex ? currentTask?.themeColor || COMPLETED_TASK_COLOR : 'rgba(255, 249, 238, 0.14)' }}
                  animate={i === currentTaskIndex ? { scale: [1, 1.28, 1], transition: { duration: 1.5, repeat: Infinity } } : {}}
                />
              ))}
            </div>
            <div className="hidden w-px h-4 bg-white/10 sm:block" />
            <div className="hidden min-w-0 truncate text-[10px] uppercase tracking-[0.16em] text-cocoa-50/65 font-body sm:block sm:text-[11px]">{routineName}</div>
            <div className="text-[11px] font-display font-semibold text-cocoa-text whitespace-nowrap sm:text-xs">Task {currentTaskIndex + 1} of {tasks.length}</div>
            </div>
          </div>
          <div className="w-10 h-10 shrink-0" />
        </div>

        <AnimatePresence mode="wait">
          <MotionDiv
            key={currentTask?.id}
            className="text-center mb-2 z-10 shrink-0 sm:mb-3"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.96 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div className="hidden items-center gap-2 rounded-full border border-cocoa-300/15 bg-white/5 px-3 py-1 text-[11px] font-body text-cocoa-100/75 mb-2 sm:inline-flex sm:text-xs sm:mb-3">
              <span>{currentTask?.itemEmoji}</span>
              <span>{taskDurationLabel}</span>
              {tasksRemaining > 0 ? <span>· {tasksRemaining} left after this</span> : <span>· final step</span>}
            </div>
            <h2
              className="font-display text-[1.55rem] sm:text-[2rem] font-bold text-center mb-1 leading-tight text-cocoa-text"
            >
              {currentTask?.title}
            </h2>
            <p className="text-[13px] sm:text-sm font-body text-cocoa-100/80 leading-snug sm:leading-relaxed px-3 sm:px-5 max-w-[20rem] mx-auto">
              {instructionText}
            </p>
          </MotionDiv>
        </AnimatePresence>

        <div className="relative z-10 mb-3 flex flex-1 min-h-0 items-center justify-center sm:mb-4">
          <div className="absolute inset-8 rounded-full bg-peach-accent/10 blur-3xl pointer-events-none" />
          <div className="relative w-full rounded-[32px] border border-cocoa-300/15 bg-gradient-to-b from-[#221710]/78 to-[#140e0a]/90 px-3 py-3.5 sm:px-6 sm:py-6 shadow-lg backdrop-blur-md flex items-center justify-center overflow-hidden">
            <div className="absolute inset-x-10 top-5 h-16 rounded-full bg-white/[0.04] blur-2xl pointer-events-none" />

            <div className="absolute top-3 left-3 rounded-full border border-cocoa-300/15 bg-white/50/92 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-cocoa-50/65 font-body sm:top-4 sm:left-4 sm:px-3 sm:py-1.5 sm:text-[11px] sm:tracking-[0.16em]">
              {isHungry ? 'Reward time' : isEatingSequence ? 'Celebrating' : isRunning ? 'In progress' : 'Paused'}
            </div>

            <div className="absolute top-3 right-3 z-20 min-w-[62px] rounded-2xl border border-cocoa-300/15 bg-white/50/94 px-2.5 py-1.5 text-center shadow-sm sm:top-4 sm:right-4 sm:min-w-[68px] sm:px-3 sm:py-2">
              <div className="text-[9px] uppercase tracking-[0.12em] text-cocoa-50/55 font-body mb-0.5 sm:text-[10px] sm:tracking-[0.14em]">Next treat</div>
              <AnimatePresence mode="wait">
              {!isItemHidden && (
                  <MotionDiv
                    key={currentTask?.id}
                    initial={{ opacity: 0, scale: 0.75, rotate: -16 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.35, type: 'spring' }}
                    className="flex justify-center"
                  >
                    <TaskItemSVG
                      itemId={currentTask?.id || ''}
                      svgGroup={currentTask?.svgGroup}
                      isFlying={isItemFlying}
                      isHidden={isItemHidden}
                    />
                  </MotionDiv>
                )}
              </AnimatePresence>
            </div>

            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <ParticleBurst active={showParticles} themeColor={currentTask?.themeColor} />
            </div>

            <AnimatePresence>
              {isHungry && !isEatingSequence && (
                <MotionDiv
                  className="absolute top-14 left-1/2 -translate-x-1/2 bg-white/50/94 border border-cocoa-300/15 rounded-2xl px-3 py-1.5 text-center z-20 shadow-sm sm:top-16 sm:px-4 sm:py-2"
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.8 }}
                >
                  <p className="font-display text-[13px] sm:text-sm font-semibold text-cocoa-text whitespace-nowrap">Feed me!</p>
                </MotionDiv>
              )}
            </AnimatePresence>

            <ProgressRing
              timeLeft={timeLeft}
              totalTime={totalTime}
              themeColor={currentTask?.themeColor || COMPLETED_TASK_COLOR}
              size={214}
              strokeWidth={11}
              className="w-[min(65vw,55vh)] h-[min(65vw,55vh)]"
            >
              <PixelRexCharacter
                state={postChompCelebrating ? 'celebrating' : rexState}
                eatPhase={eatPhase}
                themeColor={currentTask?.themeColor}
                size={146}
                characterId={selectedCharacter}
              />
            </ProgressRing>
          </div>
        </div>

        <AnimatePresence>
          {isHungry && !isEatingSequence && (
            <MotionButton
              className="btn-coral w-full text-lg sm:text-xl z-10 mb-3 shrink-0"
              onClick={handleFeed}
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{
                opacity: 1, y: 0, scale: 1,
                boxShadow: ['0 6px 18px rgba(184, 111, 86, 0.28)', '0 10px 32px rgba(184, 111, 86, 0.42)', '0 6px 18px rgba(184, 111, 86, 0.28)'],
              }}
              exit={{ opacity: 0, y: 30, scale: 0.8 }}
              transition={{ boxShadow: { duration: 1.8, repeat: Infinity }, default: { duration: 0.3, type: 'spring' } }}
              whileTap={{ scale: 0.92 }}
            >
              Feed {characterName} {currentTask?.itemEmoji}
            </MotionButton>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isWaiting && isRunning && !isEatingSequence && (
            <MotionButton
              className="btn-done-early w-full text-base sm:text-lg z-10 mb-3 shrink-0"
              onClick={handleDoneEarly}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
            >
              Done! Feed {characterName}
            </MotionButton>
          )}
        </AnimatePresence>

        {!isEatingSequence && (
          <div className="mt-auto z-10 shrink-0 rounded-[28px] border border-cocoa-300/15 bg-white/50/82 p-2.5 sm:p-3 shadow-sm backdrop-blur-md">
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {isWaiting && (
                <button
                  onClick={isRunning ? pauseRoutine : resumeRoutine}
                  className="bg-white/60/92 border border-cocoa-300/15 rounded-2xl py-2.5 sm:py-3 font-display font-semibold text-sm text-cocoa-text hover:text-cocoa-text hover:bg-[#2c1d13] transition-colors"
                >
                  {isRunning ? 'Pause' : 'Resume'}
                </button>
              )}
              <button
                onClick={skipTask}
                className={`${!isWaiting ? 'col-span-2' : ''} bg-white/60/92 border border-cocoa-300/15 rounded-2xl py-2.5 sm:py-3 font-display font-semibold text-sm text-cocoa-text hover:text-cocoa-text hover:bg-[#2c1d13] transition-colors`}
              >
                Skip
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
