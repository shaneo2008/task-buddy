import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Capacitor } from '@capacitor/core';
import { ExternalLink, Plus, Trash2, Save, X } from 'lucide-react';
import { useRoutineStore } from '../store/useRoutineStore';
import {
  readConfiguredRewards,
  readRewardsEnabled,
  writeConfiguredRewards,
  writeRewardsEnabled,
} from '../store/localStore';
import defaultRewards from '../data/rewards.json';
import Logo from '../components/Logo';
import { openExternalUrl } from '../platform/externalLinks';

const MotionButton = motion.button;

export default function Settings() {
  const setScreen = useRoutineStore((s) => s.setScreen);
  const [rewards, setRewards] = useState([]);
  const [rewardsEnabled, setRewardsEnabled] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const openLink = (url) => {
    void openExternalUrl(url).catch((error) => {
      console.error('[task-buddy] external link failed', error);
    });
  };

  useEffect(() => {
    setRewards(readConfiguredRewards(defaultRewards));
    setRewardsEnabled(readRewardsEnabled());
  }, []);

  const handleSave = () => {
    writeConfiguredRewards(rewards);
    writeRewardsEnabled(rewardsEnabled);
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
    <div className="h-full min-h-0 flex flex-col px-1 py-1 text-ink overflow-hidden sm:py-2">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3 shrink-0 sm:mb-5">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-auto" size="small" />
        </div>
        <MotionButton
          onClick={() => setScreen('selection')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-2xl bg-surface border border-border-card shadow-soft flex items-center justify-center hover:bg-surface-card transition-colors"
        >
          <X className="w-5 h-5 text-ink-muted" />
        </MotionButton>
      </div>

      {/* Title */}
      <div className="text-center mb-3 px-2 shrink-0 sm:mb-6 sm:px-4">
        <h1 className="text-[1.45rem] leading-tight font-display font-bold text-ink mb-1 sm:text-3xl sm:mb-2">
          Parent Area
        </h1>
        <p className="max-w-[18rem] mx-auto text-ink-muted text-[13px] font-body leading-snug sm:max-w-none sm:text-sm sm:leading-normal">
          Manage rewards and find privacy or support information
        </p>
      </div>

      {/* Rewards Toggle */}
      <div className="mx-2 mb-3 px-4 py-3 rounded-2xl border border-border-card bg-surface-card shadow-soft shrink-0 sm:mb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-display font-semibold text-sm text-ink mb-0.5">Enable Rewards</h3>
            <p className="text-xs text-ink-muted font-body">Show reward chest after completing routines</p>
          </div>
          <button
            onClick={handleToggleRewards}
            className={`relative w-14 h-8 rounded-full transition-all shadow-inner ${
              rewardsEnabled ? 'bg-success' : 'bg-border-card'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-6 h-6 rounded-full shadow-md transition-all flex items-center justify-center text-xs font-bold ${
                rewardsEnabled ? 'translate-x-6 bg-white text-success' : 'translate-x-0 bg-white text-ink-muted'
              }`}
            >
              {rewardsEnabled ? '✓' : '✕'}
            </span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-3 px-2 shrink-0 sm:mb-4">
        <MotionButton
          onClick={handleAddReward}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 rounded-2xl bg-accent px-4 py-2.5 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-soft"
        >
          <Plus className="w-4 h-4 text-ink" />
          <span className="text-xs font-display font-semibold text-ink">Add Reward</span>
        </MotionButton>
        {hasChanges && (
          <MotionButton
            onClick={handleSave}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 rounded-2xl border border-border-card bg-success/20 px-4 py-2.5 flex items-center justify-center gap-2 hover:bg-success/30 transition-colors"
          >
            <Save className="w-4 h-4 text-success" />
            <span className="text-xs font-display font-semibold text-ink">Save Changes</span>
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
              className="rounded-2xl border border-border-card bg-surface-card shadow-soft overflow-hidden"
            >
              {editingId === reward.id ? (
                <div className="p-3 space-y-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full bg-[#FAF3E8] border border-border-card rounded-xl px-3 py-2 text-ink text-sm font-body resize-none focus:outline-none focus:border-accent/40"
                    rows={2}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 rounded-xl bg-accent/15 border border-accent/25 px-3 py-2 text-xs font-display font-semibold text-ink hover:bg-accent/25 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 rounded-xl bg-[#FAF3E8] border border-border-card px-3 py-2 text-xs font-display font-semibold text-ink-muted hover:bg-surface-card transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-ink text-sm font-body leading-snug">{reward.text}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => handleStartEdit(reward)}
                      className="w-8 h-8 rounded-xl bg-[#FAF3E8] border border-border-card flex items-center justify-center hover:bg-surface-card transition-colors"
                    >
                      <span className="text-ink-muted text-xs">✏️</span>
                    </button>
                    <button
                      onClick={() => handleDeleteReward(reward.id)}
                      className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center hover:bg-red-100 transition-colors"
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
      <div className="px-2 pt-3 shrink-0 border-t border-border-card">
        <button
          onClick={handleReset}
          className="w-full rounded-2xl border border-border-card bg-[#FAF3E8] px-4 py-2.5 text-xs font-display font-semibold text-ink-muted hover:text-red-400 hover:border-red-200 hover:bg-red-50 transition-colors"
        >
          Reset to Defaults
        </button>
      </div>

      {/* About / Support */}
      <div className="px-2 pt-2 pb-1 shrink-0 border-t border-border-card">
        <div className="rounded-xl border border-border-card bg-surface-card p-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => openLink('https://www.taskbuddies.app/privacy')}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-border-card bg-[#FAF3E8] px-3 py-2 hover:bg-surface-card transition-colors"
          >
            <span className="text-[11px] font-display font-semibold text-ink">Privacy</span>
            <ExternalLink className="w-3 h-3 text-ink-muted" />
          </button>
          <button
            type="button"
            onClick={() => openLink('https://www.taskbuddies.app/support')}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-border-card bg-[#FAF3E8] px-3 py-2 hover:bg-surface-card transition-colors"
          >
            <span className="text-[11px] font-display font-semibold text-ink">Support</span>
            <ExternalLink className="w-3 h-3 text-ink-muted" />
          </button>
          {!Capacitor.isNativePlatform() && (
            <button
              type="button"
              onClick={() => openLink('https://buymeacoffee.com/hello6y')}
              className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl bg-accent px-3 py-2 hover:opacity-90 transition-opacity shadow-soft"
            >
              <span className="text-sm leading-none">☕</span>
              <span className="text-[11px] font-display font-semibold text-ink">Support My Work</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
