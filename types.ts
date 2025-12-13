export type Point = {
  x: number;
  y: number;
};

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export enum GameStatus {
  IDLE = 'IDLE',
  READY = 'READY',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  GAME_WON = 'GAME_WON',
  PAUSED = 'PAUSED',
  LEVEL_COMPLETE = 'LEVEL_COMPLETE',
}

export type SpeedOption = 'SLOW' | 'NORMAL' | 'FAST'; //

export interface GameState {
  snake: Point[];
  food: Point;
  bonusFood: Point | null;
  bonusFoodTimer: number;
  bonusFoodMaxTimer: number;
  direction: Direction;
  score: number;
  level: number;
  highScore: number;
  status: GameStatus;
  speed: number;
  foodsEatenLevel: number;
  moveQueue: Direction[];
}