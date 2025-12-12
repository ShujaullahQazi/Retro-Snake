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
    for(let x = xStart; x <= xEnd; x++) pts.push({x, y});
    return pts;
};

// Helper to generate vertical line
const vLine = (x: number, yStart: number, yEnd: number): Point[] => {
    const pts: Point[] = [];
    for(let y = yStart; y <= yEnd; y++) pts.push({x, y});
    return pts;
};

// Level 2: The Corridor
const LEVEL_2: Point[] = [
    ...hLine(4, 4, 15),
    ...hLine(10, 4, 15)
];

// Level 3: The Pillars
const LEVEL_3: Point[] = [
    ...vLine(5, 3, 11),
    ...vLine(14, 3, 11)
];

// Level 4: The Box
const LEVEL_4: Point[] = [
    ...hLine(5, 6, 13),
    ...hLine(9, 6, 13),
    ...vLine(6, 6, 8),
    ...vLine(13, 6, 8),
    {x: 2, y: 2}, {x: 3, y: 2}, {x: 2, y: 3},
    {x: 17, y: 2}, {x: 16, y: 2}, {x: 17, y: 3},
    {x: 2, y: 12}, {x: 3, y: 12}, {x: 2, y: 11},
    {x: 17, y: 12}, {x: 16, y: 12}, {x: 17, y: 11}
];

// Level 5: The Maze
const LEVEL_5: Point[] = [
    ...hLine(3, 2, 6),
    ...hLine(3, 13, 17),
    ...hLine(11, 2, 6),
    ...hLine(11, 13, 17),
    ...vLine(9, 5, 9),
    ...vLine(10, 5, 9),
    {x: 5, y: 7}, {x: 14, y: 7}
];

export const LEVEL_WALLS: Record<number, Point[]> = {
    1: [],
    2: LEVEL_2,
    3: LEVEL_3,
    4: LEVEL_4,
    5: LEVEL_5
};