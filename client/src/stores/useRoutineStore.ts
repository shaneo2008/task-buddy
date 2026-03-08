import { create } from "zustand";

/*
 * Routine Timer Store — Zustand state machine
 * Design: Decoupled timer logic from animation logic
 *
 * States: setup | idle | hungry | eating | transitioning | complete
 * Flow:  setup → idle → (timer expires) → hungry → (user taps) → eating → transitioning → idle (next) → ... → complete
 */

export interface Task {
  id: string;
  title: string;
  durationMinutes: number;
  itemEmoji: string;
  itemLabel: string;
  themeColor: string;
}

export type RexAnimState = "idle" | "bored" | "hungry" | "eating" | "celebrating";
export type AppScreen = "selection" | "picker" | "setup" | "player" | "complete";
export type RoutineType = "bedtime" | "morning" | "homework" | "custom";
export type CharacterId = "rex" | "snapper" | "snoozy" | "masha" | "hoppy" | "stella" | "zen" | "sparky" | "flutty" | "luna" | "buddy" | "finn";

interface RoutineState {
  // Screen
  screen: AppScreen;

  // Selected character
  selectedCharacter: CharacterId;

  // Routine data
  routineName: string;
  tasks: Task[];
  currentTaskIndex: number;

  // Timer
  timeLeft: number; // seconds
  totalTime: number; // seconds for current task
  isRunning: boolean;
  timerInterval: ReturnType<typeof setInterval> | null;

  // Rex state
  rexState: RexAnimState;

  // Actions
  setScreen: (screen: AppScreen) => void;
  setSelectedCharacter: (character: CharacterId) => void;
  setRoutine: (type: RoutineType, customName?: string) => void;
  setTasks: (tasks: Task[]) => void;
  setRoutineName: (name: string) => void;
  startRoutine: () => void;
  tick: () => void;
  feedRex: () => void;
  onEatComplete: () => void;
  resetRoutine: () => void;
  pauseRoutine: () => void;
  resumeRoutine: () => void;
  skipTask: () => void;
  doneEarly: () => void;
}

const DEFAULT_BEDTIME_TASKS: Task[] = [
  {
    id: "pajamas",
    title: "Put on Pajamas",
    durationMinutes: 1,
    itemEmoji: "👕",
    itemLabel: "Pajamas",
    themeColor: "#9B8FE8",
  },
  {
    id: "brush-teeth",
    title: "Brush Teeth",
    durationMinutes: 1,
    itemEmoji: "🪥",
    itemLabel: "Toothbrush",
    themeColor: "#5BC0EB",
  },
  {
    id: "potty",
    title: "Go Potty",
    durationMinutes: 1,
    itemEmoji: "🧻",
    itemLabel: "Toilet Paper",
    themeColor: "#FFB347",
  },
  {
    id: "pick-book",
    title: "Pick a Book",
    durationMinutes: 1,
    itemEmoji: "📖",
    itemLabel: "Book",
    themeColor: "#FF6B6B",
  },
  {
    id: "lights-off",
    title: "Lights Off",
    durationMinutes: 1,
    itemEmoji: "🌙",
    itemLabel: "Moon",
    themeColor: "#7BC74D",
  },
];

const DEFAULT_MORNING_TASKS: Task[] = [
  {
    id: "wake-up",
    title: "Get Dressed",
    durationMinutes: 5,
    itemEmoji: "👕",
    itemLabel: "Clothes",
    themeColor: "#FFB347",
  },
  {
    id: "wash-face",
    title: "Wash Face",
    durationMinutes: 2,
    itemEmoji: "🧼",
    itemLabel: "Soap",
    themeColor: "#5BC0EB",
  },
  {
    id: "brush-teeth-morning",
    title: "Brush Teeth",
    durationMinutes: 2,
    itemEmoji: "🪥",
    itemLabel: "Toothbrush",
    themeColor: "#9B8FE8",
  },
  {
    id: "eat-breakfast",
    title: "Eat Breakfast",
    durationMinutes: 10,
    itemEmoji: "🥣",
    itemLabel: "Bowl",
    themeColor: "#FF6B6B",
  },
  {
    id: "pack-bag",
    title: "Pack Your Bag",
    durationMinutes: 3,
    itemEmoji: "🎒",
    itemLabel: "Backpack",
    themeColor: "#7BC74D",
  },
];

const DEFAULT_HOMEWORK_TASKS: Task[] = [
  {
    id: "unpack-bag",
    title: "Unpack Your Bag",
    durationMinutes: 2,
    itemEmoji: "🎒",
    itemLabel: "Backpack",
    themeColor: "#FFB347",
  },
  {
    id: "have-snack",
    title: "Have a Snack",
    durationMinutes: 5,
    itemEmoji: "🍎",
    itemLabel: "Apple",
    themeColor: "#FF6B6B",
  },
  {
    id: "reading",
    title: "Reading",
    durationMinutes: 15,
    itemEmoji: "📖",
    itemLabel: "Book",
    themeColor: "#9B8FE8",
  },
  {
    id: "homework",
    title: "Homework",
    durationMinutes: 20,
    itemEmoji: "✏️",
    itemLabel: "Pencil",
    themeColor: "#5BC0EB",
  },
  {
    id: "pack-bag-homework",
    title: "Pack Bag for Tomorrow",
    durationMinutes: 3,
    itemEmoji: "📚",
    itemLabel: "Books",
    themeColor: "#7BC74D",
  },
];

export const useRoutineStore = create<RoutineState>((set, get) => ({
  screen: "selection",
  selectedCharacter: "rex",
  routineName: "Bedtime",
  tasks: DEFAULT_BEDTIME_TASKS,
  currentTaskIndex: 0,
  timeLeft: 60,
  totalTime: 60,
  isRunning: false,
  timerInterval: null,
  rexState: "idle",

  setScreen: (screen) => set({ screen }),

  setSelectedCharacter: (character) => set({ selectedCharacter: character }),

  setRoutine: (type, customName) => {
    const taskMap: Record<RoutineType, Task[]> = {
      bedtime: DEFAULT_BEDTIME_TASKS,
      morning: DEFAULT_MORNING_TASKS,
      homework: DEFAULT_HOMEWORK_TASKS,
      custom: [],
    };
    const nameMap: Record<RoutineType, string> = {
      bedtime: "Bedtime",
      morning: "Morning",
      homework: "Homework",
      custom: customName || "My Routine",
    };
    set({ tasks: taskMap[type], routineName: nameMap[type], screen: "setup" });
  },

  setTasks: (tasks) => set({ tasks }),

  setRoutineName: (name) => set({ routineName: name }),

  startRoutine: () => {
    const { tasks } = get();
    if (tasks.length === 0) return;

    const firstTask = tasks[0];
    const totalSeconds = firstTask.durationMinutes * 60;

    // Clear any existing interval
    const existing = get().timerInterval;
    if (existing) clearInterval(existing);

    const interval = setInterval(() => {
      get().tick();
    }, 1000);

    set({
      screen: "player",
      currentTaskIndex: 0,
      timeLeft: totalSeconds,
      totalTime: totalSeconds,
      isRunning: true,
      timerInterval: interval,
      rexState: "idle",
    });
  },

  tick: () => {
    const { timeLeft, isRunning, rexState } = get();
    if (!isRunning || rexState === "eating") return;

    if (timeLeft <= 1) {
      set({ timeLeft: 0, rexState: "hungry" });
    } else {
      const newTime = timeLeft - 1;
      // Switch to bored when under 30s, then hungry at 0
      let newRexState = rexState;
      if (newTime < 30 && rexState === "idle") newRexState = "bored";
      set({ timeLeft: newTime, rexState: newRexState });
    }
  },

  feedRex: () => {
    const { rexState } = get();
    if (rexState !== "hungry" && rexState !== "bored") return;
    set({ rexState: "eating", isRunning: false });
  },

  onEatComplete: () => {
    const { currentTaskIndex, tasks, timerInterval } = get();
    const nextIndex = currentTaskIndex + 1;

    if (nextIndex >= tasks.length) {
      // All tasks done!
      if (timerInterval) clearInterval(timerInterval);
      set({
        screen: "complete",
        rexState: "celebrating",
        isRunning: false,
        timerInterval: null,
      });
    } else {
      // Next task
      const nextTask = tasks[nextIndex];
      const totalSeconds = nextTask.durationMinutes * 60;
      set({
        currentTaskIndex: nextIndex,
        timeLeft: totalSeconds,
        totalTime: totalSeconds,
        rexState: "idle",
        isRunning: true,
      });
    }
  },

  resetRoutine: () => {
    const { timerInterval } = get();
    if (timerInterval) clearInterval(timerInterval);
    set({
      screen: "picker",
      currentTaskIndex: 0,
      timeLeft: 60,
      totalTime: 60,
      isRunning: false,
      timerInterval: null,
      rexState: "idle",
    });
  },

  pauseRoutine: () => {
    set({ isRunning: false });
  },

  resumeRoutine: () => {
    set({ isRunning: true });
  },

  skipTask: () => {
    const { rexState } = get();
    // Allow skip from any non-eating state
    if (rexState === "eating") return;
    set({ timeLeft: 0, rexState: "hungry" });
  },

  doneEarly: () => {
    const { rexState } = get();
    // Allow "done early" from idle or bored state
    if (rexState !== "idle" && rexState !== "bored") return;
    // Immediately transition to hungry so the eating sequence can start
    set({ timeLeft: 0, rexState: "hungry", isRunning: false });
  },
}));
