# 🐍 Nokia Snake 3310 - Technical Documentation

**Version:** 1.0.1
**Stack:** React 19, TypeScript, Vite, Tailwind CSS

## 📋 Project Overview

This project is a faithful recreation of the legendary Nokia 3310 Snake game. It recreates the specific game-feel (speed curves, wall collisions, and controls) while using modern React patterns. Unlike canvas-based implementations, we use a **DOM-based grid system** optimized with `Set` lookups for performance.

## 🛠 Tech Stack & Dependencies

  * **Core:** React 19.2+ (Functional components, Hooks)
  * **Build Tool:** Vite (ESNext target)
  * **Language:** TypeScript (Strict mode enabled)
  * **Styling:** Tailwind CSS (via CDN)
  * **Audio:** Native Web Audio API (Oscillator-based)

## 📂 Architecture

### 1\. The Game Loop (`useSnakeGame.ts`)

The game is driven by a `setInterval` loop. We avoid React "stale closure" pitfalls by using a combination of `useState` (for triggering renders) and `useRef` (for instantaneous state access inside the interval).

**Key Implementation - The Move Queue:**
To prevent the snake from colliding with itself during rapid turns (e.g., pressing Up -\> Left -\> Down quickly), we implement a move queue buffer.

```typescript
// hooks/useSnakeGame.ts

// 1. Queue logic in input handler
const lastPlannedDir = moveQueueRef.current.length > 0 
    ? moveQueueRef.current[moveQueueRef.current.length - 1] 
    : directionRef.current;

if (newDir !== lastPlannedDir && moveQueueRef.current.length < 2) {
    moveQueueRef.current.push(newDir); // Buffer the move
}

// 2. Execution in Game Tick
if (moveQueueRef.current.length > 0) {
    const nextDir = moveQueueRef.current.shift() as Direction;
    directionRef.current = nextDir;
    setDirection(nextDir); 
}
```

### 2\. Rendering Strategy (`GameBoard.tsx`)

We use a CSS Grid instead of `<canvas>`. To ensure 60fps performance with a React render loop, we optimize collision checks using `Set` lookups.

**Optimization Pattern:**
Instead of `array.some()` which is O(N) for every cell, we map snake segments to a string Set (O(1) lookup).

```typescript
// components/GameBoard.tsx
const snakeSet = useMemo(() => {
    return new Set(snake.map(s => `${s.x},${s.y}`));
}, [snake]);

// Inside the grid loop:
const coord = `${x},${y}`;
const isSnake = snakeSet.has(coord); // O(1)
```

### 3\. Audio System (`utils/sound.ts`)

We synthesize audio purely via code to keep the bundle size minimal and the latency low.

```typescript
// utils/sound.ts
export const playSound = (type: SoundType) => {
  const ctx = initAudio();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  // Square waves mimic the Nokia buzzer
  osc.type = 'square'; 
  
  // ... sound synthesis logic
  osc.start(now);
  osc.stop(now + duration);
};
```

## 🚀 Getting Started

### Prerequisites

  * Node.js (LTS recommended)

### Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```

### Development

Runs the app in development mode at `http://localhost:3000`.

```bash
npm run dev
```

### Build

Creates a production-ready build in `dist/`.

```bash
npm run build
```

## ⚙️ Configuration

Game balance constants are centralized in `src/constants.ts`.

| Constant | Value | Description |
| :--- | :--- | :--- |
| `BOARD_WIDTH` | 20 | Grid columns |
| `INITIAL_SPEED` | 200 | Starting tick rate (ms) |
| `SPEED_DECREMENT` | 25 | ms removed from tick rate per level |
| `SWIPE_THRESHOLD` | 50 | Touch sensitivity in pixels |
