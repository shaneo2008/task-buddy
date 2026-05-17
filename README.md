# Task Buddy

A free, offline-friendly routine timer for kids. Pick a buddy, build a routine, run a timer, feed your buddy each step. No signup, no backend, no tracking.

## Stack

- React + Vite
- Zustand (with `persist` to `localStorage`)
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

## Storage

All state is persisted to `localStorage` under these keys:

- `task-buddy:routines/v1` — saved task lists for the built-in routines (bedtime, morning, homework)
- `task-buddy:custom-routines/v1` — user-created custom routines and their tasks
- `task-buddy:rewards/v1` — which rewards have already been opened (rotates back to oldest once all shown)

Wipe these keys (DevTools → Application → Local Storage) to factory reset.

## Rewards

The reward bag lives in `src/data/rewards.json`. Edit that file to change the prompts your kids see when they finish a routine. Each entry just needs an `id` and `text`.

## Deploy

Deploy `dist/` to any static host (Vercel recommended). No env vars required.

## Provenance

Components and sprite art originated in the Lovou app's `buddy-timer` feature and were copied (not moved) into this standalone project. Lovou continues to ship its own copy independently.
