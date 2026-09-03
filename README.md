# Task Buddy

A free, offline-friendly routine timer for kids. Pick a buddy, build a routine, run a timer, feed your buddy each step. No signup, no backend, no tracking.

## Stack

- React + Vite
- Zustand with web `localStorage` and native Capacitor Preferences
- Tailwind CSS
- Framer Motion
- Lucide icons
- `vite-plugin-pwa` for offline install

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Native apps

Task Buddies includes Capacitor projects for Android and iOS. Use Node 22 or newer.
Android builds also require Java 21:

```bash
nvm use
npm ci
npm run check
npm run cap:sync
```

See `docs/STORE_RELEASE.md` for native builds, Codemagic signing, store setup, privacy
declarations, and release QA.

## Storage

Web state is persisted to `localStorage`; native state uses Capacitor Preferences with the
same keys:

- `task-buddy:routines/v1` — saved task lists for the built-in routines (bedtime, morning, homework)
- `task-buddy:custom-routines/v1` — user-created custom routines and their tasks
- `task-buddy:rewards/v1` — which rewards have already been opened (rotates back to oldest once all shown)

Wipe these keys in browser storage or uninstall the native app to factory reset.

## Rewards

The reward bag lives in `src/data/rewards.json`. Edit that file to change the prompts your kids see when they finish a routine. Each entry just needs an `id` and `text`.

## Deploy

Deploy `dist/` to any static host (Vercel recommended). No env vars required.

## Provenance

Components and sprite art originated in the Lovou app's `buddy-timer` feature and were copied (not moved) into this standalone project. Lovou continues to ship its own copy independently.
