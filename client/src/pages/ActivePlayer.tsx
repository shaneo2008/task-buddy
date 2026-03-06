import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PixelRexCharacter, { type EatPhase } from "@/components/rex/PixelRexCharacter";
import ProgressRing from "@/components/rex/ProgressRing";
import TaskItemSVG from "@/components/rex/TaskItemSVG";
import ParticleBurst from "@/components/rex/ParticleBurst";
import { useRoutineStore } from "@/stores/useRoutineStore";

/*
 * ActivePlayer — The main routine gameplay screen
 * Design: Finch-style warm pastel, mobile-first
 *
 * The pixel art character is rendered INSIDE the ProgressRing,
 * centered within the circular countdown.
 *
 * Orchestrated Eating Timeline:
 *   T = 0ms:    Item flies to mouth (spring curve CSS transition)
 *   T = 400ms:  Rex jaw opens (anticipation)
 *   T = 600ms:  Item hidden, jaw snaps, particles burst, squash-stretch
 *   T = 1200ms: Hide particles
 *   T = 1500ms: Next task, reset all states to idle
 */

export default function ActivePlayer() {
  const {
    tasks,
    currentTaskIndex,
    timeLeft,
    totalTime,
    rexState,
    feedRex,
    doneEarly,
    onEatComplete,
    skipTask,
    pauseRoutine,
    resumeRoutine,
    isRunning,
    selectedCharacter,
  } = useRoutineStore();

  const currentTask = tasks[currentTaskIndex];
  
  // Debug logging
  useEffect(() => {
    console.log("[ActivePlayer] Task changed:", currentTaskIndex, "Task:", currentTask?.title, "rexState:", rexState);
  }, [currentTaskIndex, currentTask, rexState]);
  
  const isHungry = rexState === "hungry";
  const isBored = rexState === "bored";
  const isIdle = rexState === "idle";
  const isWaiting = isIdle || isBored;

  // Capitalise character name for display
  const characterName = selectedCharacter
    ? selectedCharacter.charAt(0).toUpperCase() + selectedCharacter.slice(1)
    : "Rex";

  // === Eating animation orchestration state ===
  const [eatPhase, setEatPhase] = useState<EatPhase>("none");
  const [isItemFlying, setIsItemFlying] = useState(false);
  const [isItemHidden, setIsItemHidden] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [isEatingSequence, setIsEatingSequence] = useState(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // Reset eating animation state when task changes
  useEffect(() => {
    setEatPhase("none");
    setIsItemFlying(false);
    setIsItemHidden(false);
    setShowParticles(false);
    setIsEatingSequence(false);
  }, [currentTaskIndex]);

  // Shared eating animation sequence
  const startEatingSequence = useCallback(() => {
    console.log("[startEatingSequence] Starting...");
    // Use functional update to check isEatingSequence without it being a dependency
    let wasAlreadyRunning = false;
    setIsEatingSequence((prev) => {
      wasAlreadyRunning = prev;
      return true;
    });
    if (wasAlreadyRunning) {
      console.log("[startEatingSequence] Already running, aborting");
      return;
    }

    console.log("[startEatingSequence] Calling feedRex");
    feedRex();

    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    // T = 0ms: Item flies to mouth
    setIsItemFlying(true);

    // T = 400ms: Jaw opens
    timeoutsRef.current.push(
      setTimeout(() => {
        setEatPhase("jaw-open");
      }, 400)
    );

    // T = 600ms: The Chomp
    timeoutsRef.current.push(
      setTimeout(() => {
        setIsItemHidden(true);
        setEatPhase("chomp");
        setShowParticles(true);
      }, 600)
    );

    // T = 1200ms: Hide particles
    timeoutsRef.current.push(
      setTimeout(() => {
        setShowParticles(false);
      }, 1200)
    );

    // T = 2000ms: Next task (after chomp animation fully plays — 1600ms)
    timeoutsRef.current.push(
      setTimeout(() => {
        console.log("[startEatingSequence] Timeout firing, calling onEatComplete");
        setEatPhase("none");
        setIsItemFlying(false);
        setIsItemHidden(false);
        setIsEatingSequence(false);
        onEatComplete();
      }, 2000)
    );
    console.log("[startEatingSequence] Sequence started, timeout set");
  }, [feedRex, onEatComplete]);

  // Feed button handler (when hungry)
  const handleFeed = useCallback(() => {
    if (!isHungry || isEatingSequence) return;
    startEatingSequence();
  }, [isHungry, isEatingSequence, startEatingSequence]);

  // Done Early handler (when timer is still running)
  const handleDoneEarly = useCallback(() => {
    if (!isWaiting || isEatingSequence) return;
    doneEarly();
  }, [isWaiting, isEatingSequence, doneEarly]);

  // Prevent scroll bounce on mobile
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const instructionText = `${currentTask?.title || ""}! ${characterName} is waiting...`;

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-6 pb-8 relative overflow-hidden">
      {/* Floating background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: 20 + Math.random() * 40,
              height: 20 + Math.random() * 40,
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              background: currentTask?.themeColor || "#7BC74D",
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut" as const,
            }}
          />
        ))}
      </div>

      {/* === Task Progress Dots === */}
      <div className="flex gap-2 mb-4 z-10">
        {tasks.map((task, i) => (
          <motion.div
            key={task.id}
            className="w-3 h-3 rounded-full"
            style={{
              background:
                i < currentTaskIndex
                  ? "#7BC74D"
                  : i === currentTaskIndex
                  ? currentTask?.themeColor || "#7BC74D"
                  : "rgba(232, 220, 200, 0.4)",
            }}
            animate={
              i === currentTaskIndex
                ? { scale: [1, 1.3, 1], transition: { duration: 1.5, repeat: Infinity } }
                : {}
            }
          />
        ))}
      </div>

      {/* === Task Counter === */}
      <motion.p
        className="text-sm font-semibold text-muted-foreground mb-1 z-10"
        key={currentTaskIndex}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Task {currentTaskIndex + 1} of {tasks.length}
      </motion.p>

      {/* === Task Title === */}
      <AnimatePresence mode="wait">
        <motion.h2
          key={currentTask?.id}
          className="font-display text-2xl font-bold text-center mb-4 z-10"
          style={{ color: currentTask?.themeColor }}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.4, ease: "easeOut" as const }}
        >
          {currentTask?.title}
        </motion.h2>
      </AnimatePresence>

      {/* === Progress Ring with Lottie Character INSIDE === */}
      <div className="relative z-10 mb-4">
        {/* Floating task item — positioned relative to the ring */}
        <div className="absolute -top-2 -right-4 z-20">
          <AnimatePresence mode="wait">
            {!isItemHidden && (
              <motion.div
                key={currentTask?.id}
                initial={{ opacity: 0, scale: 0, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                <TaskItemSVG
                  itemId={currentTask?.id || ""}
                  isFlying={isItemFlying}
                  isHidden={isItemHidden}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Particle Burst — layered over the ring center */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <ParticleBurst
            active={showParticles}
            themeColor={currentTask?.themeColor}
          />
        </div>

        {/* Rex speech bubble */}
        <AnimatePresence>
          {isHungry && !isEatingSequence && (
            <motion.div
              className="absolute -top-10 left-1/2 -translate-x-1/2 glass-card px-4 py-2 text-center z-20"
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
            >
              <p className="font-display text-sm font-semibold text-foreground whitespace-nowrap">
                Feed me!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The Progress Ring with pixel art character centered inside */}
        <ProgressRing
          timeLeft={timeLeft}
          totalTime={totalTime}
          themeColor={currentTask?.themeColor || "#7BC74D"}
          size={240}
          strokeWidth={10}
        >
          {/* Pixel art character — centered inside the ring, above the timer */}
          <PixelRexCharacter
            state={rexState}
            eatPhase={eatPhase}
            themeColor={currentTask?.themeColor}
            size={120}
            characterId={selectedCharacter}
          />
        </ProgressRing>
      </div>

      {/* === Feed Button (when hungry) === */}
      <AnimatePresence>
        {isHungry && !isEatingSequence && (
          <motion.button
            className="btn-coral w-full max-w-xs text-xl z-10"
            onClick={handleFeed}
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              boxShadow: [
                "0 4px 14px rgba(255, 107, 107, 0.35)",
                "0 4px 30px rgba(255, 107, 107, 0.6)",
                "0 4px 14px rgba(255, 107, 107, 0.35)",
              ],
            }}
            exit={{ opacity: 0, y: 30, scale: 0.8 }}
            transition={{
              boxShadow: { duration: 1.5, repeat: Infinity },
              default: { duration: 0.3, type: "spring" },
            }}
            whileTap={{ scale: 0.92 }}
          >
            Feed {characterName}! {currentTask?.itemEmoji}
          </motion.button>
        )}
      </AnimatePresence>

      {/* === "I did it!" / Done Early Button === */}
      <AnimatePresence>
        {isWaiting && isRunning && !isEatingSequence && (
          <motion.div
            className="flex flex-col items-center gap-2 z-10 w-full max-w-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.p className="text-center text-muted-foreground font-semibold text-sm max-w-xs">
              {instructionText}
            </motion.p>

            <motion.button
              className="btn-done-early w-full text-lg"
              onClick={handleDoneEarly}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
            >
              I did it! 🎉 Feed {characterName}!
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === Task instruction (when paused) === */}
      {isWaiting && !isRunning && !isEatingSequence && (
        <motion.p
          className="text-center text-muted-foreground font-semibold text-sm z-10 max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {instructionText}
        </motion.p>
      )}

      {/* === Bottom Controls === */}
      <div className="mt-auto flex gap-3 z-10 w-full max-w-xs pt-4">
        {!isEatingSequence && isWaiting && (
          <button
            onClick={isRunning ? pauseRoutine : resumeRoutine}
            className="flex-1 glass-card py-3 font-display font-semibold text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {isRunning ? "Pause" : "Resume"}
          </button>
        )}

        {!isEatingSequence && (
          <button
            onClick={skipTask}
            className="flex-1 glass-card py-3 font-display font-semibold text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
