import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import CharacterSelection from "./pages/CharacterSelection";
import RoutinePicker from "./pages/RoutinePicker";
import RoutineSetup from "./pages/RoutineSetup";
import ActivePlayer from "./pages/ActivePlayer";
import RoutineComplete from "./pages/RoutineComplete";
import { useRoutineStore } from "./stores/useRoutineStore";
import { AnimatePresence, motion } from "framer-motion";

/*
 * App — Rex Routine Builder
 * Design: Finch-style warm pastel, mobile-first
 *
 * Screen routing is driven by Zustand store (screen state)
 * not by URL routing — this is a single-screen app
 */

function ScreenRouter() {
  const screen = useRoutineStore((s) => s.screen);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screen}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.3, ease: "easeOut" as const }}
        className="min-h-screen"
      >
        {screen === "selection" && <CharacterSelection />}
        {screen === "picker" && <RoutinePicker />}
        {screen === "setup" && <RoutineSetup />}
        {screen === "player" && <ActivePlayer />}
        {screen === "complete" && <RoutineComplete />}
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <div className="max-w-md mx-auto">
            <ScreenRouter />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
