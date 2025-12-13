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

### 1. State Management (Reducer Pattern)

The core game logic has been migrated to a **pure Reducer** (`hooks/gameReducer.ts`). This ensures predictable state transitions and decoupling from React's render cycle.

-   **`gameReducer.ts`**: Handles all game rules (Movement, Collision, Food, Level Up).
-   **`useSnakeGame.ts`**: A thin wrapper that connects the Reducer to the Game Loop and Audio system.

```typescript
// hooks/gameReducer.ts
export const gameReducer = (state: GameState, action: GameAction): GameState => {
    switch (action.type) {
        case 'TICK':
            // Logic for movement, collision, eating
            return { ...state, snake: newSnake, status: newStatus };
        case 'CHANGE_DIRECTION':
             // Logic for direction changes with 180-degree turn prevention
            return { ...state, direction: action.direction };
        // ...
    }
};
```

### 2. The Game Loop (`hooks/useGameLoop.ts`)

The `setInterval` logic is abstracted into a custom hook `useGameLoop`, which accepts a callback and a speed. This keeps the component clean and handles the "stale closure" problem via refs.

### 3. Component Structure

The UI is broken down into modular components for maintainability:

-   `components/GameBoard.tsx`: The grid rendering engine (optimized with `Set` lookups).
-   `components/ScoreBoard.tsx`: Top HUD displaying score/level.
-   `components/overlays/*.tsx`: Independent menus for Game Over, Pause, and Win states.

### 4. Audio System (`hooks/useGameAudio.ts`)

Audio is synthesized via the Web Audio API (`utils/sound.ts`). The `useGameAudio` hook provides a stable interface for triggering sounds, and `useSnakeGame` synchronizes these sounds with state changes (e.g., detecting when `score` increases to play 'eat').

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
