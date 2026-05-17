import { create } from 'zustand';
import { TASK_LIBRARY, DEFAULT_ROUTINE_TASKS, getTaskByKey } from './taskLibrary';
import {
  readSavedRoutineTasks,
  writeSavedRoutineTasks,
  readCustomRoutineTasks,
  writeCustomRoutineTasks,
} from './localStore';

/*
 * Routine Timer Store — Zustand state machine.
 * States: setup | idle | hungry | eating | transitioning | complete
 * Persistence: Saved task lists go to localStorage; in-memory timer state
 * is intentionally not persisted across reloads.
 */

const TASK_COLORS = ['#9D8AAE', '#86A4B3', '#C89A63', '#B86F56', '#81906F', '#B68FA1'];

function toRuntimeTask(task, index) {
  const libEntry = getTaskByKey(task.task_type_key || task.key);
  return {
    id: task.id || task.task_type_key || task.key || `task-${index}`,
    title: task.custom_label || task.label || (libEntry?.label) || 'Task',
    durationMinutes: task.duration_minutes || task.durationMinutes || task.defaultMinutes || 2,
    itemEmoji: task.emoji || (libEntry?.emoji) || '⭐',
    itemLabel: libEntry?.label || 'Task',
    svgGroup: task.svgGroup || (libEntry?.svgGroup) || 'question-mark',
    themeColor: TASK_COLORS[index % TASK_COLORS.length],
    task_type_key: task.task_type_key || task.key,
  };
}

function getDefaultTasksForType(type) {
  const keys = DEFAULT_ROUTINE_TASKS[type] || [];
  return keys.map((key, i) => {
    const lib = getTaskByKey(key);
    if (!lib) return null;
    return toRuntimeTask({ ...lib, task_type_key: key }, i);
  }).filter(Boolean);
}

export const useRoutineStore = create((set, get) => ({
  screen: 'selection',
  selectedCharacter: 'rex',
  routineName: 'Bedtime',
  routineType: 'bedtime',
  tasks: getDefaultTasksForType('bedtime'),
  currentTaskIndex: 0,
  timeLeft: 60,
  totalTime: 60,
  isRunning: false,
  timerInterval: null,
  timerEndsAt: null,
  rexState: 'idle',
  hasSavedRoutine: false,
  customRoutineId: null,

  setScreen: (screen) => set({ screen }),

  setSelectedCharacter: (character) => set({ selectedCharacter: character }),

  setRoutine: (type, customName, customRoutineId) => {
    const nameMap = {
      bedtime:  'Bedtime',
      morning:  'Morning',
      homework: 'Homework',
      custom:   customName || 'My Routine',
    };
    const isCustomSaved = type.startsWith('custom:');
    const displayName = isCustomSaved ? (customName || 'Custom') : nameMap[type];

    // Resolve persisted tasks
    let resolved = null;
    let hasSaved = false;
    if (isCustomSaved && customRoutineId) {
      const rows = readCustomRoutineTasks(customRoutineId);
      if (rows && rows.length > 0) {
        resolved = rows.map((row, i) => toRuntimeTask(row, i));
        hasSaved = true;
      }
    } else if (type !== 'custom') {
      const rows = readSavedRoutineTasks(type);
      if (rows && rows.length > 0) {
        resolved = rows.map((row, i) => toRuntimeTask(row, i));
        hasSaved = true;
      }
    }

    if (!resolved) {
      resolved = isCustomSaved ? [] : getDefaultTasksForType(type);
    }

    set({
      tasks: resolved,
      routineName: displayName,
      routineType: type,
      screen: 'setup',
      hasSavedRoutine: hasSaved,
      customRoutineId: customRoutineId || null,
    });
  },

  saveRoutine: async () => {
    const { routineType, tasks, customRoutineId } = get();
    if (!routineType) return;
    if (routineType === 'custom' && !customRoutineId) return;
    const taskRows = tasks.map((t) => ({
      task_type_key: t.task_type_key || t.id,
      custom_label: t.title !== getTaskByKey(t.task_type_key)?.label ? t.title : null,
      emoji: t.itemEmoji,
      duration_minutes: t.durationMinutes,
    }));
    if (routineType.startsWith('custom:') && customRoutineId) {
      writeCustomRoutineTasks(customRoutineId, taskRows);
    } else {
      writeSavedRoutineTasks(routineType, taskRows);
    }
    set({ hasSavedRoutine: true });
  },

  setTasks: (tasks) => set({ tasks }),

  setRoutineName: (name) => set({ routineName: name }),

  startRoutine: () => {
    const { tasks } = get();
    if (tasks.length === 0) return;
    const firstTask = tasks[0];
    const totalSeconds = firstTask.durationMinutes * 60;
    const existing = get().timerInterval;
    if (existing) clearInterval(existing);
    const interval = setInterval(() => { get().tick(); }, 1000);
    set({
      screen: 'player',
      currentTaskIndex: 0,
      timeLeft: totalSeconds,
      totalTime: totalSeconds,
      isRunning: true,
      timerInterval: interval,
      timerEndsAt: Date.now() + totalSeconds * 1000,
      rexState: 'idle',
    });
  },

  tick: () => {
    const { timeLeft, isRunning, rexState, timerEndsAt, timerInterval } = get();
    if (!isRunning || rexState === 'eating') return;

    const newTime = timerEndsAt
      ? Math.max(0, Math.ceil((timerEndsAt - Date.now()) / 1000))
      : Math.max(0, timeLeft);

    if (newTime <= 0) {
      if (timerInterval) clearInterval(timerInterval);
      set({ timeLeft: 0, rexState: 'hungry', isRunning: false, timerInterval: null, timerEndsAt: null });
    } else {
      let newRexState = rexState;
      if (newTime < 30 && rexState === 'idle') newRexState = 'bored';
      set({ timeLeft: newTime, rexState: newRexState });
    }
  },

  feedRex: () => {
    const { rexState } = get();
    if (rexState !== 'hungry' && rexState !== 'bored') return;
    set({ rexState: 'eating', isRunning: false, timerEndsAt: null });
  },

  onEatComplete: () => {
    const { currentTaskIndex, tasks, timerInterval } = get();
    const nextIndex = currentTaskIndex + 1;
    if (nextIndex >= tasks.length) {
      if (timerInterval) clearInterval(timerInterval);
      set({ screen: 'complete', rexState: 'celebrating', isRunning: false, timerInterval: null, timerEndsAt: null });
    } else {
      const nextTask = tasks[nextIndex];
      const totalSeconds = nextTask.durationMinutes * 60;
      set({ currentTaskIndex: nextIndex, timeLeft: totalSeconds, totalTime: totalSeconds, rexState: 'idle', isRunning: true, timerEndsAt: Date.now() + totalSeconds * 1000 });
    }
  },

  resetRoutine: () => {
    const { timerInterval } = get();
    if (timerInterval) clearInterval(timerInterval);
    set({ screen: 'selection', currentTaskIndex: 0, timeLeft: 60, totalTime: 60, isRunning: false, timerInterval: null, timerEndsAt: null, rexState: 'idle' });
  },

  cancelRoutine: () => {
    const { timerInterval, tasks } = get();
    if (timerInterval) clearInterval(timerInterval);
    const firstTask = tasks[0];
    const totalSeconds = firstTask ? firstTask.durationMinutes * 60 : 60;
    set({ screen: 'setup', currentTaskIndex: 0, timeLeft: totalSeconds, totalTime: totalSeconds, isRunning: false, timerInterval: null, timerEndsAt: null, rexState: 'idle' });
  },

  pauseRoutine: () => {
    get().tick();
    set({ isRunning: false, timerEndsAt: null });
  },

  resumeRoutine: () => {
    const { timeLeft, rexState } = get();
    if (timeLeft <= 0 || rexState === 'hungry' || rexState === 'eating') return;
    set({ isRunning: true, timerEndsAt: Date.now() + timeLeft * 1000 });
  },

  skipTask: () => {
    const { rexState } = get();
    if (rexState === 'eating') return;
    set({ timeLeft: 0, rexState: 'hungry', isRunning: false, timerEndsAt: null });
  },

  doneEarly: () => {
    const { rexState } = get();
    if (rexState !== 'idle' && rexState !== 'bored') return;
    set({ timeLeft: 0, rexState: 'hungry', isRunning: false, timerEndsAt: null });
  },
}));

// Re-export library helpers for convenience
export { TASK_LIBRARY };
