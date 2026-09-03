import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Haptics, NotificationType } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { flushStorage } from './storage';
import { useRoutineStore } from '../store/useRoutineStore';

const TIMER_NOTIFICATION_ID = 1001;
const TIMER_CHANNEL_ID = 'task-timers';

let wakeLock = null;
let notificationSignature = null;
let notificationsUnavailable = false;
let notificationRevision = 0;

function isNative() {
  return Capacitor.isNativePlatform();
}

function clearTimerInterval() {
  const { timerInterval } = useRoutineStore.getState();
  if (timerInterval) clearInterval(timerInterval);
  useRoutineStore.setState({ timerInterval: null });
}

function reconcileTimer() {
  const state = useRoutineStore.getState();
  if (state.screen !== 'player' || !state.isRunning || !state.timerEndsAt) return;

  state.tick();
  const nextState = useRoutineStore.getState();
  if (nextState.isRunning && nextState.timerEndsAt) {
    nextState._ensureInterval();
  }
}

async function ensureNotificationPermission() {
  if (notificationsUnavailable) return false;

  const current = await LocalNotifications.checkPermissions();
  if (current.display === 'granted') return true;

  const requested = await LocalNotifications.requestPermissions();
  if (requested.display === 'granted') return true;

  notificationsUnavailable = true;
  return false;
}

async function cancelTimerNotification() {
  await LocalNotifications.cancel({
    notifications: [{ id: TIMER_NOTIFICATION_ID }],
  });
}

async function syncTimerNotification(state) {
  if (!isNative()) return;

  const task = state.tasks[state.currentTaskIndex];
  const nextSignature = state.screen === 'player' && state.isRunning && state.timerEndsAt && task
    ? `${state.timerEndsAt}:${task.id}`
    : null;

  if (nextSignature === notificationSignature) return;
  notificationSignature = nextSignature;
  const revision = ++notificationRevision;

  try {
    await cancelTimerNotification();
    if (!nextSignature || revision !== notificationRevision) return;
    if (!await ensureNotificationPermission() || revision !== notificationRevision) return;

    await LocalNotifications.schedule({
      notifications: [{
        id: TIMER_NOTIFICATION_ID,
        channelId: TIMER_CHANNEL_ID,
        title: 'Task complete',
        body: `${task.title} is finished. Return to feed your buddy.`,
        schedule: { at: new Date(state.timerEndsAt) },
      }],
    });
  } catch (error) {
    console.error('[task-buddy] timer notification failed', error);
  }
}

async function updateWakeLock(state) {
  const shouldStayAwake = state.screen === 'player' && state.isRunning;

  if (!shouldStayAwake && wakeLock) {
    await wakeLock.release();
    wakeLock = null;
    return;
  }

  if (shouldStayAwake && !wakeLock && document.visibilityState === 'visible' && 'wakeLock' in navigator) {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => {
        wakeLock = null;
      }, { once: true });
    } catch {
      wakeLock = null;
    }
  }
}

function handleBackButton() {
  const state = useRoutineStore.getState();

  if (state.screen === 'player') {
    state.cancelRoutine();
  } else if (state.screen === 'setup') {
    state.setScreen(state.routineType.startsWith('custom:') ? 'customList' : 'picker');
  } else if (['picker', 'customList', 'parentGate'].includes(state.screen)) {
    state.setScreen('selection');
  } else if (state.screen === 'settings') {
    state.setScreen('parentGate');
  } else if (state.screen === 'complete') {
    state.resetRoutine();
  } else {
    void CapacitorApp.exitApp();
  }
}

async function configureNativeUI() {
  document.documentElement.classList.add('native-app', `native-${Capacitor.getPlatform()}`);

  await Promise.allSettled([
    StatusBar.setStyle({ style: Style.Light }),
    StatusBar.setOverlaysWebView({ overlay: false }),
    SplashScreen.hide(),
  ]);

  if (Capacitor.getPlatform() === 'android') {
    await Promise.allSettled([
      StatusBar.setBackgroundColor({ color: '#FAF3E8' }),
      LocalNotifications.createChannel({
        id: TIMER_CHANNEL_ID,
        name: 'Routine timers',
        description: 'Alerts when a routine step is complete',
        importance: 4,
        visibility: 1,
        vibration: true,
      }),
    ]);
  }
}

export function initializeNativeRuntime() {
  if (!isNative()) return undefined;

  let active = true;
  void configureNativeUI();
  void syncTimerNotification(useRoutineStore.getState());
  void updateWakeLock(useRoutineStore.getState());

  const removeStoreListener = useRoutineStore.subscribe((state, previousState) => {
    void syncTimerNotification(state);
    void updateWakeLock(state);

    if (state.rexState === 'hungry' && previousState.rexState !== 'hungry') {
      void Haptics.notification({ type: NotificationType.Success });
    }
    if (state.screen === 'complete' && previousState.screen !== 'complete') {
      void Haptics.notification({ type: NotificationType.Success });
    }
  });

  const listenerHandles = [
    CapacitorApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        reconcileTimer();
        void updateWakeLock(useRoutineStore.getState());
      } else {
        clearTimerInterval();
        void flushStorage();
      }
    }),
    CapacitorApp.addListener('backButton', handleBackButton),
    LocalNotifications.addListener('localNotificationActionPerformed', reconcileTimer),
  ];

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      reconcileTimer();
      void updateWakeLock(useRoutineStore.getState());
    }
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    active = false;
    notificationSignature = null;
    notificationRevision += 1;
    removeStoreListener();
    clearTimerInterval();
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    void cancelTimerNotification();
    void flushStorage();
    if (wakeLock) void wakeLock.release();
    wakeLock = null;

    void Promise.all(listenerHandles).then((handles) => {
      if (!active) handles.forEach((handle) => handle.remove());
    });
  };
}
