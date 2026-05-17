import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Plus, Trash2, Save, X } from 'lucide-react';
import { useRoutineStore } from '../store/useRoutineStore';
import defaultRewards from '../data/rewards.json';
import Logo from '../components/Logo';

const MotionButton = motion.button;

export default function Settings() {
  const setScreen = useRoutineStore((s) => s.setScreen);
  const [rewards, setRewards] = useState([]);
  const [rewardsEnabled, setRewardsEnabled] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('taskbuddy_rewards');
    if (saved) {
      try {
        setRewards(JSON.parse(saved));
      } catch {
        setRewards(defaultRewards);
      }
    } else {
      setRewards(defaultRewards);
    }
    
    const enabledSetting = localStorage.getItem('taskbuddy_rewards_enabled');
    if (enabledSetting !== null) {
      setRewardsEnabled(enabledSetting === 'true');
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('taskbuddy_rewards', JSON.stringify(rewards));
    localStorage.setItem('taskbuddy_rewards_enabled', rewardsEnabled.toString());
    setHasChanges(false);
  };
  
  const handleToggleRewards = () => {
    setRewardsEnabled(!rewardsEnabled);
    setHasChanges(true);
  };

  const handleAddReward = () => {
    const newReward = {
      id: `custom-${Date.now()}`,
      text: 'New reward - tap to edit'
    };
    setRewards([...rewards, newReward]);
    setHasChanges(true);
  };

  const handleDeleteReward = (id) => {
    setRewards(rewards.filter(r => r.id !== id));
    setHasChanges(true);
  };

  const handleStartEdit = (reward) => {
    setEditingId(reward.id);
    setEditText(reward.text);
  };

  const handleSaveEdit = () => {
    setRewards(rewards.map(r => 
      r.id === editingId ? { ...r, text: editText } : r
    ));
    setEditingId(null);
    setEditText('');
    setHasChanges(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleReset = () => {
    if (confirm('Reset all rewards to defaults? This cannot be undone.')) {
      setRewards(defaultRewards);
      setHasChanges(true);
    }
  };

  return (
    <div className="h-full min-h-0 flex flex-col px-1 py-1 text-cocoa-text overflow-hidden sm:py-2">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3 shrink-0 sm:mb-5">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-auto" size="small" />
        </div>
        <MotionButton
          onClick={() => setScreen('selection')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-2xl bg-white/60 border border-cocoa-300/15 shadow-sm flex items-center justify-center hover:bg-white/80 transition-colors backdrop-blur-sm"
        >
          <X className="w-5 h-5 text-cocoa-100" />
        </MotionButton>
      </div>

      {/* Title */}
      <div className="text-center mb-3 px-2 shrink-0 sm:mb-6 sm:px-4">
        <h1 className="text-[1.45rem] leading-tight font-display font-bold text-cocoa-text mb-1 sm:text-3xl sm:mb-2">
          Manage Rewards
        </h1>
        <p className="max-w-[18rem] mx-auto text-cocoa-100 text-[13px] font-body leading-snug sm:max-w-none sm:text-sm sm:leading-normal">
          Customize the rewards your child can earn after completing tasks
        </p>
      </div>

      {/* Rewards Toggle */}
      <div className="mx-2 mb-3 px-4 py-3 rounded-2xl border border-cocoa-300/15 bg-white/50 shadow-sm backdrop-blur-md shrink-0 sm:mb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-display font-semibold text-sm text-cocoa-text mb-0.5">Enable Rewards</h3>
            <p className="text-xs text-cocoa-50 font-body">Show reward chest after completing routines</p>
          </div>
          <button
            onClick={handleToggleRewards}
            className={`relative w-12 h-7 rounded-full transition-colors ${
              rewardsEnabled ? 'bg-peach-accent' : 'bg-cocoa-300/30'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                rewardsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-3 px-2 shrink-0 sm:mb-4">
        <MotionButton
          onClick={handleAddReward}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 rounded-2xl border border-peach-accent/25 bg-peach-accent/15 px-4 py-2.5 flex items-center justify-center gap-2 hover:bg-peach-accent/25 transition-colors"
        >
          <Plus className="w-4 h-4 text-peach-300" />
          <span className="text-xs font-display font-semibold text-peach-300">Add Reward</span>
        </MotionButton>
        {hasChanges && (
          <MotionButton
            onClick={handleSave}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-2.5 flex items-center justify-center gap-2 hover:bg-green-500/15 transition-colors"
          >
            <Save className="w-4 h-4 text-green-400" />
            <span className="text-xs font-display font-semibold text-green-400">Save Changes</span>
          </MotionButton>
        )}
      </div>

      {/* Rewards List */}
      <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-2" data-buddy-scroll="true">
        <div className="space-y-2">
          {rewards.map((reward, index) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className="rounded-2xl border border-cocoa-300/15 bg-white/50 shadow-sm backdrop-blur-md overflow-hidden"
            >
              {editingId === reward.id ? (
                <div className="p-3 space-y-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full bg-white/60 border border-cocoa-300/20 rounded-xl px-3 py-2 text-cocoa-text text-sm font-body resize-none focus:outline-none focus:border-peach-accent/40"
                    rows={2}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 rounded-xl bg-peach-accent/15 border border-peach-accent/25 px-3 py-2 text-xs font-display font-semibold text-peach-300 hover:bg-peach-accent/25 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 rounded-xl bg-white/40 border border-cocoa-300/20 px-3 py-2 text-xs font-display font-semibold text-cocoa-100 hover:bg-white/60 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-cocoa-text text-sm font-body leading-snug">{reward.text}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => handleStartEdit(reward)}
                      className="w-8 h-8 rounded-xl bg-white/40 border border-cocoa-300/20 flex items-center justify-center hover:bg-white/60 transition-colors"
                    >
                      <span className="text-cocoa-100 text-xs">✏️</span>
                    </button>
                    <button
                      onClick={() => handleDeleteReward(reward.id)}
                      className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center hover:bg-red-500/15 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <div className="px-2 pt-3 shrink-0 border-t border-white/10">
        <button
          onClick={handleReset}
          className="w-full rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs font-display font-semibold text-red-400 hover:bg-red-500/15 transition-colors"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
