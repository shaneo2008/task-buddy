import { useState, useCallback } from 'react';
import { motion, Reorder, AnimatePresence, useDragControls } from 'framer-motion';
import { ChevronDown, ChevronUp, GripVertical, Minus, Plus, Play, Settings2, Trash2, PlusCircle, X, Save } from 'lucide-react';
import { nanoid } from 'nanoid';
import PixelRexCharacter from '../components/rex/PixelRexCharacter';
import { useRoutineStore } from '../store/useRoutineStore';
import { getTasksForRoutine } from '../store/taskLibrary';
import Logo from '../components/Logo';

const TASK_COLORS = ['#9D8AAE', '#86A4B3', '#C89A63', '#B86F56', '#81906F', '#B68FA1'];
const MotionDiv = motion.div;
const MotionButton = motion.button;
const MotionP = motion.p;

export default function RoutineSetup() {
  const { tasks, setTasks, startRoutine, routineName, routineType, selectedCharacter, setScreen, saveRoutine, hasSavedRoutine } = useRoutineStore();
  const characterName = selectedCharacter.charAt(0).toUpperCase() + selectedCharacter.slice(1);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const totalMinutes = tasks.reduce((sum, t) => sum + t.durationMinutes, 0);
  const averageMinutes = tasks.length > 0 ? Math.round(totalMinutes / tasks.length) : 0;

  const updateTaskDuration = useCallback((taskId, delta) => {
    setTasks(tasks.map((t) => t.id === taskId ? { ...t, durationMinutes: Math.max(1, Math.min(60, t.durationMinutes + delta)) } : t));
  }, [tasks, setTasks]);

  const deleteTask = useCallback((taskId) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }, [tasks, setTasks]);

  const addTaskFromLibrary = useCallback((libTask) => {
    const color = TASK_COLORS[tasks.length % TASK_COLORS.length];
    setTasks([...tasks, {
      id: nanoid(),
      title: libTask.label,
      durationMinutes: libTask.defaultMinutes,
      itemEmoji: libTask.emoji,
      itemLabel: libTask.label,
      svgGroup: libTask.svgGroup,
      themeColor: color,
      task_type_key: libTask.key,
    }]);
    setShowPicker(false);
  }, [tasks, setTasks]);

  const addBlankTask = useCallback(() => {
    const color = TASK_COLORS[tasks.length % TASK_COLORS.length];
    setTasks([...tasks, { id: nanoid(), title: '', durationMinutes: 5, itemEmoji: '❓', itemLabel: 'Task', svgGroup: 'question-mark', themeColor: color, task_type_key: 'custom' }]);
  }, [tasks, setTasks]);

  const updateTaskTitle = useCallback((taskId, title) => {
    setTasks(tasks.map((t) => t.id === taskId ? { ...t, title } : t));
  }, [tasks, setTasks]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    await saveRoutine();
    setIsSaving(false);
  }, [saveRoutine]);

  return (
    <div data-buddy-scroll="true" className={`w-full h-full min-h-0 flex flex-col items-center overflow-x-hidden overscroll-contain px-1 py-1 pb-4 text-cocoa-text sm:py-2 sm:pb-8 ${showBuilder ? 'overflow-y-auto' : 'overflow-hidden'}`}>
      <div className="w-full max-w-sm flex items-center gap-2 mb-3 shrink-0 sm:mb-5">
        <button
          onClick={() => setScreen(routineType.startsWith('custom:') ? 'customList' : 'picker')}
          className="w-10 h-10 rounded-2xl bg-white/60 border border-cocoa-300/15 flex items-center justify-center text-cocoa-100 hover:text-cocoa-text hover:bg-white/80 transition-colors backdrop-blur-sm shadow-sm"
        >
          <span className="text-sm">←</span>
        </button>
        <Logo className="h-8 w-auto" size="small" />
      </div>

      <MotionDiv className="text-center mb-2.5 shrink-0 sm:mb-3" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="hidden text-[11px] uppercase tracking-[0.18em] text-cocoa-50/60 font-body mb-1.5 sm:block">Task Buddies</div>
        <h1 className="font-display text-[1.5rem] sm:text-3xl font-bold text-cocoa-text mb-1 leading-tight">{characterName}'s {routineName}</h1>
        <p className="hidden text-cocoa-100/75 font-body text-[13px] sm:block sm:text-sm leading-snug">Complete tasks to feed {characterName}.</p>
      </MotionDiv>

      <MotionDiv className="relative w-full max-w-sm mb-2.5 shrink-0 sm:mb-3" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
        <div className="absolute inset-6 rounded-full bg-peach-accent/10 blur-3xl pointer-events-none" />
        <div className="relative rounded-[32px] border border-cocoa-300/15 bg-white/40 px-3 py-3.5 sm:px-6 sm:py-6 shadow-lg backdrop-blur-md overflow-hidden text-center">
          <div className="absolute inset-x-10 top-4 h-16 rounded-full bg-white/[0.04] blur-2xl pointer-events-none" />
          <div className="hidden items-center gap-2 rounded-full border border-cocoa-300/15 bg-white/50/88 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-cocoa-50/65 font-body shadow-sm backdrop-blur-md mb-3 sm:inline-flex sm:py-1.5 sm:text-[11px] sm:mb-4">
            <span>Routine Preview</span>
            <span className="text-cocoa-text">{tasks.length} tasks</span>
          </div>
          <PixelRexCharacter state="idle" size={132} className="mx-auto sm:[transform:scale(1)]" characterId={selectedCharacter} />
          <div className="mt-2.5 grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-cocoa-300/15 bg-white/50/82 px-3 py-2">
              <div className="text-[10px] uppercase tracking-[0.14em] text-cocoa-50/55 font-body">Total</div>
              <div className="text-sm font-display font-semibold text-cocoa-text mt-1">{totalMinutes} min</div>
            </div>
            <div className="rounded-2xl border border-cocoa-300/15 bg-white/50/82 px-3 py-2">
              <div className="text-[10px] uppercase tracking-[0.14em] text-cocoa-50/55 font-body">Average</div>
              <div className="text-sm font-display font-semibold text-cocoa-text mt-1">{averageMinutes || 0} min</div>
            </div>
            <div className="rounded-2xl border border-cocoa-300/15 bg-white/50/82 px-3 py-2">
              <div className="text-[10px] uppercase tracking-[0.14em] text-cocoa-50/55 font-body">Buddy</div>
              <div className="text-sm font-display font-semibold text-cocoa-text mt-1">{characterName}</div>
            </div>
          </div>
        </div>
      </MotionDiv>

      <MotionDiv className="w-full max-w-sm rounded-[28px] border border-cocoa-300/15 bg-white/50/82 p-3 shadow-sm backdrop-blur-md mb-2.5 shrink-0 sm:p-4 sm:mb-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <div className="text-center mb-2">
          <div className="text-[11px] uppercase tracking-[0.16em] text-cocoa-50/55 font-body">Ready to begin</div>
          <p className="hidden text-[13px] sm:block sm:text-sm text-cocoa-100/80 font-body mt-1">Start when you want the first step and timer to begin.</p>
        </div>
        <MotionButton
          className="btn-primary w-full flex items-center justify-center gap-2 text-lg sm:text-xl"
          onClick={startRoutine}
          whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}
        >
          <Play className="w-6 h-6 fill-current" />
          Start Routine!
        </MotionButton>
        {!showBuilder && (
          <button onClick={() => setShowBuilder(true)} className="mt-2.5 w-full h-11 rounded-2xl border border-cocoa-300/15 bg-white/60/85 hover:bg-white/70 transition-colors flex items-center justify-center gap-2 px-3">
            <Settings2 className="w-4.5 h-4.5 text-cocoa-100/80" />
            <span className="text-xs font-display font-semibold text-cocoa-text">Edit</span>
            <ChevronDown className="w-4 h-4 text-cocoa-100/70" />
          </button>
        )}
        <MotionP className="hidden text-sm text-cocoa-50/65 mt-3 font-body text-center sm:block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          Total time: {totalMinutes} minutes
        </MotionP>
      </MotionDiv>

      <AnimatePresence>
        {showBuilder && (
          <MotionDiv
            className="glass-card-solid w-full max-w-sm p-3 text-cocoa-text mb-2.5 sm:p-4 sm:mb-4"
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-cocoa-text">{routineName} Routine</h3>
                <p className="text-[13px] sm:text-sm text-cocoa-100/75 font-body">{tasks.length} tasks · {totalMinutes} min total</p>
              </div>
              <button onClick={() => setShowBuilder(false)} className="min-w-[92px] h-11 rounded-2xl border border-cocoa-300/15 bg-white/60/85 hover:bg-white/70 transition-colors flex items-center justify-center gap-2 px-3">
                <Settings2 className="w-4.5 h-4.5 text-cocoa-100/80" />
                <span className="text-xs font-display font-semibold text-cocoa-text">Edit</span>
                <ChevronUp className="w-4 h-4 text-cocoa-100/70" />
              </button>
            </div>

            <MotionDiv className="pr-1" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
              <Reorder.Group axis="y" values={tasks} onReorder={setTasks} className="space-y-2 pb-1">
                {tasks.map((task) => (
                  <TaskBuilderItem
                    key={task.id}
                    task={task}
                    onDurationChange={(delta) => updateTaskDuration(task.id, delta)}
                    onDelete={() => deleteTask(task.id)}
                    onTitleChange={(title) => updateTaskTitle(task.id, title)}
                  />
                ))}
              </Reorder.Group>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setShowPicker(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-white/20 hover:border-peach-accent/35 hover:bg-peach-accent/5 transition-colors text-sm font-display font-semibold text-cocoa-100/80 hover:text-peach-300"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add task
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl border border-cocoa-300/15 bg-peach-accent/10 hover:bg-peach-accent/20 transition-colors text-sm font-display font-semibold text-peach-300 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : hasSavedRoutine ? 'Saved' : 'Save'}
                </button>
              </div>
              <p className="text-xs text-cocoa-50/65 text-center mt-2 font-body">Drag to reorder · Tap +/- to adjust time</p>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Task Picker Modal */}
      <AnimatePresence>
        {showPicker && (
          <MotionDiv
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPicker(false)} />
            <MotionDiv
              className="relative w-full max-w-md max-h-[70vh] bg-white/50 border-t border-cocoa-300/15 rounded-t-3xl shadow-2xl overflow-hidden flex flex-col"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 shrink-0">
                <h3 className="font-display font-bold text-lg text-cocoa-text">Add a Task</h3>
                <button onClick={() => setShowPicker(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-cocoa-100 hover:text-cocoa-text transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5">
                {getTasksForRoutine(routineType).map((libTask) => (
                  <button
                    key={libTask.key}
                    onClick={() => addTaskFromLibrary(libTask)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/8 bg-white/60/70 hover:bg-white/70 hover:border-white/15 transition-colors text-left"
                  >
                    <span className="text-2xl shrink-0">{libTask.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-semibold text-sm text-cocoa-text truncate">{libTask.label}</div>
                      <div className="text-xs text-cocoa-50/60 font-body">{libTask.defaultMinutes} min</div>
                    </div>
                    <PlusCircle className="w-5 h-5 text-cocoa-50/50 shrink-0" />
                  </button>
                ))}
                <div className="pt-2 border-t border-white/8">
                  <button
                    onClick={() => { addBlankTask(); setShowPicker(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border border-dashed border-white/15 hover:border-peach-accent/30 hover:bg-peach-accent/5 transition-colors text-left"
                  >
                    <span className="text-2xl shrink-0">❓</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-semibold text-sm text-cocoa-text">Custom Task</div>
                      <div className="text-xs text-cocoa-50/60 font-body">Name it yourself</div>
                    </div>
                    <PlusCircle className="w-5 h-5 text-peach-300/60 shrink-0" />
                  </button>
                </div>
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
}

function TaskBuilderItem({ task, onDurationChange, onDelete, onTitleChange }) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={task}
      dragControls={dragControls}
      dragListener={false}
      className="flex flex-col gap-2 py-3 px-3.5 rounded-2xl bg-white/60/78 border border-white/8 cursor-grab active:cursor-grabbing"
      whileDrag={{ scale: 1.03, boxShadow: '0 14px 30px rgba(0, 0, 0, 0.35)', backgroundColor: 'rgba(44, 29, 19, 0.96)' }}
    >
      {/* Row 1 — task name, full width */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onPointerDown={(event) => {
            event.stopPropagation();
            dragControls.start(event);
          }}
          className="shrink-0 rounded-lg p-0.5 touch-none cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4 text-cocoa-50/45" />
        </button>
        <span className="text-lg shrink-0">{task.itemEmoji}</span>
        <input
          type="text"
          value={task.title}
          onChange={(e) => onTitleChange(e.target.value)}
          onPointerDown={(e) => e.stopPropagation()}
          placeholder="Task name..."
          className="flex-1 min-w-0 bg-transparent font-display font-semibold text-sm text-cocoa-text placeholder:text-cocoa-50/45 outline-none border-b border-transparent focus:border-white/20 truncate"
        />
      </div>
      {/* Row 2 — duration stepper + delete, aligned right under the title */}
      <div className="flex items-center justify-end gap-1.5 pl-9">
        <div className="flex items-center rounded-xl border border-cocoa-300/15 bg-white/60 overflow-hidden">
          <button
            onClick={(e) => { e.stopPropagation(); onDurationChange(-1); }}
            onPointerDown={(e) => e.stopPropagation()}
            disabled={task.durationMinutes <= 1}
            className="w-8 h-8 flex items-center justify-center hover:bg-white/50 transition-colors disabled:opacity-30 text-cocoa-text"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="min-w-[3rem] px-1 text-center font-display font-bold text-sm" style={{ color: task.themeColor }}>
            {task.durationMinutes}m
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onDurationChange(1); }}
            onPointerDown={(e) => e.stopPropagation()}
            disabled={task.durationMinutes >= 60}
            className="w-8 h-8 flex items-center justify-center hover:bg-white/50 transition-colors disabled:opacity-30 text-cocoa-text"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          onPointerDown={(e) => e.stopPropagation()}
          className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-cocoa-50/50 hover:text-danger hover:bg-danger/10 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </Reorder.Item>
  );
}
