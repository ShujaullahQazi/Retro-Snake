import { Direction, Point } from "./types";

export const BOARD_WIDTH = 20;
export const BOARD_HEIGHT = 15;
export const INITIAL_SPEED = 200;
//

export const POINTS_NORMAL = 10;
export const POINTS_BIG = 50;
export const FOODS_TO_BONUS = 5;
export const FOODS_PER_LEVEL = 10;
export const MAX_LEVEL = 5;
export const BONUS_DURATION_MS = 3000;

// Touch Controls
export const SWIPE_THRESHOLD = 50;

// Centralized Palette
export const COLORS = {
    // Device Case
    CASE_BODY: '#444444',
    CASE_ACCENT: '#222222',
    CASE_BORDER: '#111111',
    CASE_SHADOW: 'rgba(0,0,0,0.5)',

    // Screen
    SCREEN_BG: '#9ea71e',
    SCREEN_BG_DIM: '#8b9318',
    SCREEN_PIXEL: '#0f380f',
    SCREEN_PIXEL_DIM: 'rgba(15, 56, 15, 0.05)',

    // UI / Buttons
    BUTTON_MAIN: '#333',
    BUTTON_TEXT: '#fff',
    BUTTON_ACTIVE: '#9ea71e',
    BUTTON_INACTIVE: '#2c3e50',

    // LEDs
    LED_RED_ON: '#ef4444',
    LED_RED_OFF: '#7f1d1d',
};

export const INITIAL_SNAKE = [
    { x: 10, y: 12 },
    { x: 10, y: 13 },
    { x: 10, y: 14 },
];

export const INITIAL_DIRECTION = Direction.UP;

// Helper to generate horizontal line
const hLine = (y: number, xStart: number, xEnd: number): Point[] => {
    const pts: Point[] = [];
    for (let x = xStart; x <= xEnd; x++) pts.push({ x, y });
    return pts;
};

// Helper to generate vertical line
const vLine = (x: number, yStart: number, yEnd: number): Point[] => {
    const pts: Point[] = [];
    for (let y = yStart; y <= yEnd; y++) pts.push({ x, y });
    return pts;
};

// Level 2: The Gateway
const LEVEL_2: Point[] = [
    ...hLine(4, 0, 5), ...hLine(4, 14, 19),
    ...hLine(10, 0, 5), ...hLine(10, 14, 19)
];

// Level 3: The Pillars (Widened)
const LEVEL_3: Point[] = [
    ...vLine(5, 4, 10),
    ...vLine(14, 4, 10)
];

// Level 4: The Corners (Replaces The Box)
const LEVEL_4: Point[] = [
    { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 4, y: 4 },
    { x: 15, y: 3 }, { x: 14, y: 3 }, { x: 15, y: 4 },
    { x: 4, y: 11 }, { x: 5, y: 11 }, { x: 4, y: 10 },
    { x: 15, y: 11 }, { x: 14, y: 11 }, { x: 15, y: 10 },
    // Center block
    { x: 9, y: 7 }, { x: 10, y: 7 }
];

// Level 5: The Maze (Opened)
const LEVEL_5: Point[] = [
    ...hLine(3, 4, 15),
    ...hLine(11, 4, 15),
    ...vLine(9, 5, 6),
    ...vLine(10, 5, 6),
    ...vLine(9, 8, 9),
    ...vLine(10, 8, 9),
];

export interface LevelConfig {
    wrapX: boolean; // Allow wrapping Left/Right
    wrapY: boolean; // Allow wrapping Top/Bottom
    // Optional: exact segments that are BLOCKED even if wrap is on
    // range is [min, max] inclusive. If provided, these edges are solid walls.
    blockedX?: [number, number][]; // Y-ranges where X-wrapping is blocked
    blockedY?: [number, number][]; // X-ranges where Y-wrapping is blocked
}

export const LEVEL_WALLS: Record<number, Point[]> = {
    1: [],
    2: LEVEL_2,
    3: LEVEL_3,
    4: LEVEL_4,
    5: LEVEL_5
};

export const LEVEL_CONFIGS: Record<number, LevelConfig> = {
    1: { wrapX: false, wrapY: false },
    2: { wrapX: false, wrapY: false },
    3: { wrapX: false, wrapY: false },
    4: { wrapX: false, wrapY: false },
    5: { wrapX: false, wrapY: false }
};