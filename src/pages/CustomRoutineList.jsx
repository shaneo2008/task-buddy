import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Trash2 } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useRoutineStore } from '../store/useRoutineStore';
import {
  readCustomRoutines,
  createCustomRoutineLocal,
  deleteCustomRoutineLocal,
} from '../store/localStore';

const MotionDiv = motion.div;
const MotionButton = motion.button;

const EMOJI_OPTIONS = ['✏️', '🏀', '🎶', '🧹', '🌿', '🎮', '🍳', '🐕', '🎨', '📖', '🧘', '💪', '🚿', '🎒'];

export default function CustomRoutineList() {
  const { setRoutine, setScreen } = useRoutineStore();
  const [routines, setRoutines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('✏️');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const loadRoutines = useCallback(() => {
    setRoutines(readCustomRoutines());
    setIsLoading(false);
  }, []);

  useEffect(() => { loadRoutines(); }, [loadRoutines]);

  const handleCreate = () => {
    if (!newName.trim()) return;
    const created = createCustomRoutineLocal(nanoid(), newName.trim(), newEmoji);
    setShowCreate(false);
    setNewName('');
    setNewEmoji('✏️');
    setRoutine(`custom:${created.id}`, created.name, created.id);
  };

  const handleDelete = (routineId) => {
    deleteCustomRoutineLocal(routineId);
    setRoutines((prev) => prev.filter((r) => r.id !== routineId));
    setConfirmDelete(null);
  };

  const handleSelect = (routine) => {
    setRoutine(`custom:${routine.id}`, routine.name, routine.id);
  };

  return (
    <div data-buddy-scroll="true" className="h-full min-h-full flex flex-col px-1 py-1 text-cocoa-text overflow-hidden sm:py-2">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 shrink-0 sm:mb-5">
        <button
          onClick={() => setScreen('picker')}
          className="w-10 h-10 rounded-2xl bg-white/50/85 border border-cocoa-300/15 flex items-center justify-center text-cocoa-text hover:text-cocoa-text hover:bg-white/60 transition-colors"
        >
          <span className="text-sm">←</span>
        </button>
        <div className="w-10 h-10 rounded-2xl bg-[#7FC56A]/15 border border-[#7FC56A]/20 flex items-center justify-center">
          <span className="text-lg">✏️</span>
        </div>
        <span className="font-display font-semibold text-cocoa-text text-sm tracking-[0.02em]">Custom Routines</span>
      </div>

      {/* Title */}
      <div className="text-center mb-4 px-2 shrink-0 sm:mb-6 sm:px-4">
        <h1 className="text-[1.6rem] leading-tight font-display font-bold text-cocoa-text mb-1 sm:text-3xl sm:mb-2">Your Routines</h1>
        <p className="text-cocoa-100/75 text-[13px] font-body leading-snug sm:text-sm">Create and manage custom routines</p>
      </div>

      {/* Content */}
      <div className="relative w-full max-w-sm mx-auto flex-1 min-h-0 overflow-y-auto mb-2 sm:mb-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-sm text-cocoa-100/70 font-body animate-pulse">Loading routines...</div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {routines.map((routine, i) => (
              <MotionDiv
                key={routine.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="relative"
              >
                <button
                  onClick={() => handleSelect(routine)}
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-[24px] border border-[#7FC56A]/25 bg-[#7FC56A]/8 hover:bg-[#7FC56A]/14 hover:border-[#7FC56A]/40 transition-all text-left shadow-sm"
                >
                  <div className="w-12 h-12 rounded-[16px] flex items-center justify-center border border-cocoa-300/15 bg-white/50/55 text-2xl shrink-0">
                    {routine.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display font-semibold text-cocoa-text text-base truncate">{routine.name}</div>
                    <div className="text-xs text-cocoa-100/60 font-body mt-0.5">Tap to edit & run</div>
                  </div>
                  <span className="text-cocoa-50/50 text-sm">→</span>
                </button>

                {/* Delete button */}
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDelete(routine.id); }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center text-cocoa-50/40 hover:text-red-400 hover:bg-red-400/10 transition-colors z-10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </MotionDiv>
            ))}

            {routines.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">✨</div>
                <p className="text-sm text-cocoa-100/70 font-body leading-relaxed">No custom routines yet.<br />Create your first one below!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create New Button */}
      <div className="max-w-sm mx-auto w-full shrink-0 pb-2 sm:pb-4">
        <MotionButton
          onClick={() => setShowCreate(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-dashed border-[#7FC56A]/30 bg-[#7FC56A]/8 hover:bg-[#7FC56A]/14 hover:border-[#7FC56A]/50 transition-all text-sm font-display font-semibold text-[#7FC56A]"
        >
          <PlusCircle className="w-5 h-5" />
          Create New Routine
        </MotionButton>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center z-50 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              className="bg-white/50/95 border border-cocoa-300/15 rounded-[28px] p-6 w-full max-w-xs shadow-lg text-cocoa-text"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#7FC56A]/20 bg-[#7FC56A]/12 text-2xl">
                {newEmoji}
              </div>
              <h2 className="font-display font-bold text-cocoa-text text-lg mb-1 text-center">New Custom Routine</h2>
              <p className="text-cocoa-100/75 text-sm text-center mb-4 font-body">Give it a name and pick an icon</p>

              <input
                autoFocus
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                placeholder="e.g. Sports Night"
                maxLength={24}
                className="w-full bg-white/70 border-2 border-cocoa-300/20 rounded-2xl px-4 py-3 text-cocoa-text placeholder:text-cocoa-50 font-body text-base outline-none focus:border-peach-accent/50 mb-3 backdrop-blur-sm"
              />

              {/* Emoji picker */}
              <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setNewEmoji(emoji)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
                      newEmoji === emoji
                        ? 'bg-[#7FC56A]/20 border-2 border-[#7FC56A]/50 scale-110'
                        : 'bg-white/5 border border-white/8 hover:bg-white/10'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="btn-primary w-full disabled:opacity-40"
              >
                Create Routine 🎉
              </button>
              <button
                onClick={() => { setShowCreate(false); setNewName(''); }}
                className="w-full mt-2 text-sm text-cocoa-50/65 hover:text-cocoa-text py-2 font-body"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            className="fixed inset-0 bg-black/55 backdrop-blur-sm flex items-center justify-center z-50 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              className="bg-white/50/95 border border-cocoa-300/15 rounded-[28px] p-6 w-full max-w-xs shadow-lg text-cocoa-text"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/12 text-2xl">
                🗑️
              </div>
              <h2 className="font-display font-bold text-cocoa-text text-lg mb-1 text-center">Delete Routine?</h2>
              <p className="text-cocoa-100/75 text-sm text-center mb-4 font-body">This will remove the routine and all its saved tasks. This can't be undone.</p>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="w-full py-3 rounded-2xl bg-red-500/20 border border-red-400/30 text-red-300 font-display font-bold text-sm hover:bg-red-500/30 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="w-full mt-2 text-sm text-cocoa-50/65 hover:text-cocoa-text py-2 font-body"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
