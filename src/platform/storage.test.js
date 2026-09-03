import { beforeEach, describe, expect, it, vi } from 'vitest';

const preferences = vi.hoisted(() => {
  const values = new Map();
  return {
    isNative: true,
    values,
    get: vi.fn(async ({ key }) => ({ value: values.get(key) ?? null })),
    set: vi.fn(async ({ key, value }) => {
      values.set(key, value);
    }),
    remove: vi.fn(async ({ key }) => {
      values.delete(key);
    }),
  };
});

vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: () => preferences.isNative,
  },
}));

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: preferences.get,
    set: preferences.set,
    remove: preferences.remove,
  },
}));

describe('platform storage', () => {
  beforeEach(() => {
    preferences.isNative = true;
    preferences.values.clear();
    preferences.get.mockClear();
    preferences.set.mockClear();
    preferences.remove.mockClear();
    window.localStorage.clear();
    vi.resetModules();
  });

  it('migrates known browser values into native Preferences', async () => {
    window.localStorage.setItem('task-buddy:last-buddy', 'hoppy');

    const { initializeStorage, persistentStorage } = await import('./storage');
    await initializeStorage();

    expect(persistentStorage.getItem('task-buddy:last-buddy')).toBe('hoppy');
    expect(preferences.values.get('task-buddy:last-buddy')).toBe('hoppy');
  });

  it('flushes queued native writes before the app backgrounds', async () => {
    const { flushStorage, initializeStorage, persistentStorage } = await import('./storage');
    await initializeStorage();

    persistentStorage.setItem('routine-timer-state', '{"state":{"screen":"player"}}');
    await flushStorage();

    expect(preferences.values.get('routine-timer-state')).toBe('{"state":{"screen":"player"}}');
  });

  it('keeps synchronous localStorage behavior on the web', async () => {
    preferences.isNative = false;
    const { initializeStorage, persistentStorage } = await import('./storage');
    await initializeStorage();

    persistentStorage.setItem('task-buddy:last-routine', 'morning');

    expect(window.localStorage.getItem('task-buddy:last-routine')).toBe('morning');
    expect(persistentStorage.getItem('task-buddy:last-routine')).toBe('morning');
  });
});
