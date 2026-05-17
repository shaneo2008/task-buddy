/**
 * Tiny localStorage helpers for Task Buddy. Replaces all Supabase reads/writes
 * the original Lovou feature relied on.
 *
 * Keys:
 *   task-buddy:routines/v1         { [routineType]: TaskRow[] }
 *   task-buddy:custom-routines/v1  Routine[]   ({ id, name, emoji, tasks })
 *   task-buddy:rewards/v1          { [rewardId]: lastShownAtISO }
 */

const KEYS = {
  routines: 'task-buddy:routines/v1',
  custom:   'task-buddy:custom-routines/v1',
  rewards:  'task-buddy:rewards/v1',
};

function safeRead(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function safeWrite(key, value) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('[task-buddy] storage write failed', key, err);
  }
}

// ── Saved tasks per built-in routine type ─────────────────────────────
export function readSavedRoutineTasks(routineType) {
  const all = safeRead(KEYS.routines, {});
  return Array.isArray(all[routineType]) ? all[routineType] : null;
}

export function writeSavedRoutineTasks(routineType, taskRows) {
  const all = safeRead(KEYS.routines, {});
  all[routineType] = taskRows;
  safeWrite(KEYS.routines, all);
}

// ── Custom routines ───────────────────────────────────────────────────
export function readCustomRoutines() {
  const list = safeRead(KEYS.custom, []);
  return Array.isArray(list) ? list : [];
}

export function writeCustomRoutines(list) {
  safeWrite(KEYS.custom, list);
}

export function createCustomRoutineLocal(id, name, emoji) {
  const list = readCustomRoutines();
  const next = [{ id, name, emoji, tasks: [], created_at: new Date().toISOString() }, ...list];
  writeCustomRoutines(next);
  return next[0];
}

export function deleteCustomRoutineLocal(routineId) {
  const list = readCustomRoutines().filter((r) => r.id !== routineId);
  writeCustomRoutines(list);
}

export function readCustomRoutineTasks(routineId) {
  const found = readCustomRoutines().find((r) => r.id === routineId);
  return found && Array.isArray(found.tasks) ? found.tasks : null;
}

export function writeCustomRoutineTasks(routineId, taskRows) {
  const list = readCustomRoutines();
  const idx = list.findIndex((r) => r.id === routineId);
  if (idx === -1) return;
  list[idx] = { ...list[idx], tasks: taskRows };
  writeCustomRoutines(list);
}

// ── Reward shown-state ────────────────────────────────────────────────
export function readShownRewards() {
  return safeRead(KEYS.rewards, {});
}

export function markRewardShownLocal(rewardId) {
  const map = readShownRewards();
  map[rewardId] = new Date().toISOString();
  safeWrite(KEYS.rewards, map);
}
