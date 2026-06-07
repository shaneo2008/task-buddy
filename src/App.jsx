/**
 * Task Buddy — standalone orchestrator.
 * Originally extracted from Lovou's BuddyTimerApp.
 */

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRoutineStore } from './store/useRoutineStore';
import CharacterSelection from './pages/CharacterSelection';
import RoutinePicker from './pages/RoutinePicker';
import RoutineSetup from './pages/RoutineSetup';
import ActivePlayer from './pages/ActivePlayer';
import RoutineComplete from './pages/RoutineComplete';
import CustomRoutineList from './pages/CustomRoutineList';
import Settings from './pages/Settings';

const MotionDiv = motion.div;

const pageTransition = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

export default function App() {
  const screen = useRoutineStore((s) => s.screen);
  const rootRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const resetScroll = () => {
      const screenScrollContainer = rootRef.current?.querySelector('[data-buddy-scroll="true"]');
      const scrollContainer = rootRef.current?.parentElement;

      screenScrollContainer?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      if (screenScrollContainer) screenScrollContainer.scrollTop = 0;

      scrollContainer?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      if (scrollContainer) scrollContainer.scrollTop = 0;

      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();
    const frameId = window.requestAnimationFrame(resetScroll);
    return () => window.cancelAnimationFrame(frameId);
  }, [screen]);

  // On mount: if the page was reloaded while a routine was running (mobile tab discard),
  // restart the interval from the persisted timerEndsAt.
  useEffect(() => {
    const { screen: s, isRunning, timerEndsAt } = useRoutineStore.getState();
    if (s === 'player' && isRunning && timerEndsAt) {
      const remaining = Math.max(0, Math.round((timerEndsAt - Date.now()) / 1000));
      if (remaining <= 0) {
        useRoutineStore.getState().tick();
      } else {
        useRoutineStore.getState()._ensureInterval();
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // On unmount: stop the interval but preserve state so the timer can resume on reload.
  useEffect(() => () => {
    const { timerInterval } = useRoutineStore.getState();
    if (timerInterval) clearInterval(timerInterval);
    useRoutineStore.setState({ timerInterval: null });
  }, []);

  return (
    <div ref={rootRef} className="relative h-[100dvh] min-h-0 bg-cream-gradient text-cocoa-text overflow-hidden">
      <div className="absolute inset-0 bg-cream-glow pointer-events-none" />
      <div className="relative max-w-md mx-auto flex h-full min-h-0 w-full flex-col px-3 py-2 sm:px-4 sm:py-6">
        <AnimatePresence mode="wait">
          {screen === 'selection' && (
            <MotionDiv key="selection" {...pageTransition} className="flex h-full min-h-0 flex-col">
              <CharacterSelection />
            </MotionDiv>
          )}
          {screen === 'picker' && (
            <MotionDiv key="picker" {...pageTransition} className="flex h-full min-h-0 flex-col">
              <RoutinePicker />
            </MotionDiv>
          )}
          {screen === 'customList' && (
            <MotionDiv key="customList" {...pageTransition} className="flex h-full min-h-0 flex-col">
              <CustomRoutineList />
            </MotionDiv>
          )}
          {screen === 'setup' && (
            <MotionDiv key="setup" {...pageTransition} className="flex h-full min-h-0 flex-col">
              <RoutineSetup />
            </MotionDiv>
          )}
          {screen === 'player' && (
            <MotionDiv key="player" {...pageTransition} className="flex h-full min-h-0 flex-col">
              <ActivePlayer />
            </MotionDiv>
          )}
          {screen === 'complete' && (
            <MotionDiv key="complete" {...pageTransition} className="flex h-full min-h-0 flex-col">
              <RoutineComplete />
            </MotionDiv>
          )}
          {screen === 'settings' && (
            <MotionDiv key="settings" {...pageTransition} className="flex h-full min-h-0 flex-col">
              <Settings />
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
