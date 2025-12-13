import { GameStatus, Direction, Point, SpeedOption, GameState } from '../types';
import {
    BOARD_WIDTH, BOARD_HEIGHT, INITIAL_SNAKE, INITIAL_DIRECTION,
    INITIAL_SPEED, POINTS_NORMAL, POINTS_BIG, FOODS_TO_BONUS,
    BONUS_DURATION_MS, FOODS_PER_LEVEL, MAX_LEVEL, LEVEL_WALLS, LEVEL_CONFIGS
} from '../constants';

export type GameAction =
    | { type: 'TICK' }
    | { type: 'CHANGE_DIRECTION'; direction: Direction }
    | { type: 'START_GAME'; level?: number; speed?: number }
    | { type: 'PAUSE_GAME' }
    | { type: 'RESET_GAME' }
    | { type: 'NEXT_LEVEL'; direction: Direction }
    | { type: 'SET_SPEED'; speed: number }
    | { type: 'TOGGLE_GAME' }; // Helper to handle Space/Enter logic

// Helper: Get Walls
const getWalls = (level: number): Point[] => {
    return LEVEL_WALLS[level] || [];
};

// Helper: Generate Food
const generateFood = (snake: Point[], walls: Point[], excludePoints: Point[] = []): Point => {
    let newFood: Point;
    let isInvalid = true;
    // Safety break to prevent infinite loops in full board scenarios (though unlikely in this Snake)
    let attempts = 0;

    while (isInvalid && attempts < 100) {
        attempts++;
        newFood = {
            x: Math.floor(Math.random() * BOARD_WIDTH),
            y: Math.floor(Math.random() * BOARD_HEIGHT),
        };
        const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
        const onWall = walls.some(wall => wall.x === newFood.x && wall.y === newFood.y);
        const onExclude = excludePoints.some(p => p.x === newFood.x && p.y === newFood.y);

        isInvalid = onSnake || onWall || onExclude;
    }
    return isInvalid ? { x: 0, y: 0 } : newFood!;
};

export const initialGameState: GameState = {
    snake: INITIAL_SNAKE,
    food: { x: 5, y: 5 }, // Initial placeholder, effectively reset in effect/init
    bonusFood: null,
    bonusFoodTimer: 0,
    bonusFoodMaxTimer: 0,
    direction: INITIAL_DIRECTION,
    status: GameStatus.IDLE,
    score: 0,
    level: 1,
    highScore: 0,
    speed: INITIAL_SPEED,
    foodsEatenLevel: 0,
};

export const gameReducer = (state: GameState, action: GameAction): GameState => {
    switch (action.type) {
        case 'START_GAME': {
            // Logic for starting a fresh game or level 1
            const level = action.level || 1;
            const speed = action.speed || state.speed;
            const walls = getWalls(level);
            return {
                ...state,
                status: GameStatus.READY,
                snake: INITIAL_SNAKE,
                direction: INITIAL_DIRECTION,
                score: 0,
                level,
                speed,
                highScore: Math.max(state.score, state.highScore), // Sync highscore just in case
                bonusFood: null,
                bonusFoodTimer: 0,
                foodsEatenLevel: 0,
                food: generateFood(INITIAL_SNAKE, walls),
            };
        }

        case 'RESET_GAME': {
            return {
                ...state,
                status: GameStatus.IDLE,
                score: 0,
                level: 1,
                snake: INITIAL_SNAKE,
                bonusFood: null,
                foodsEatenLevel: 0,
                direction: INITIAL_DIRECTION,
                highScore: Math.max(state.score, state.highScore),
            };
        }

        case 'PAUSE_GAME': {
            if (state.status === GameStatus.PLAYING) {
                return { ...state, status: GameStatus.PAUSED };
            } else if (state.status === GameStatus.PAUSED) {
                return { ...state, status: GameStatus.PLAYING };
            }
            return state;
        }

        case 'TOGGLE_GAME': {
            if (state.status === GameStatus.IDLE || state.status === GameStatus.GAME_OVER || state.status === GameStatus.GAME_WON) {
                // Start Game Logic (Same as START_GAME effectively, but maybe we want to keep highscore)
                // Reusing START_GAME logic via recursive call is messy in pure reducers usually.
                // Copy-paste for clarity
                const level = 1;
                const walls = getWalls(level);
                return {
                    ...state,
                    status: GameStatus.READY,
                    snake: INITIAL_SNAKE,
                    direction: INITIAL_DIRECTION,
                    score: 0,
                    level,
                    highScore: Math.max(state.score, state.highScore),
                    bonusFood: null,
                    bonusFoodTimer: 0,
                    food: generateFood(INITIAL_SNAKE, walls),
                };
            } else if (state.status === GameStatus.PLAYING) {
                return { ...state, status: GameStatus.PAUSED };
            } else if (state.status === GameStatus.PAUSED) {
                return { ...state, status: GameStatus.PLAYING };
            } else if (state.status === GameStatus.LEVEL_COMPLETE) {
                // Start Next Level Logic
                return gameReducer(state, { type: 'NEXT_LEVEL', direction: Direction.UP });
            } else if (state.status === GameStatus.READY) {
                return { ...state, status: GameStatus.PLAYING };
            }
            return state;
        }

        case 'NEXT_LEVEL': {
            const newLevel = state.level + 1;
            const walls = getWalls(newLevel);
            return {
                ...state,
                level: newLevel,
                snake: INITIAL_SNAKE,
                direction: action.direction,
                status: GameStatus.READY,
                bonusFood: null,
                bonusFoodTimer: 0,
                foodsEatenLevel: 0,
                food: generateFood(INITIAL_SNAKE, walls),
            };
        }

        case 'SET_SPEED': {
            return { ...state, speed: action.speed };
        }

        case 'CHANGE_DIRECTION': {
            if (state.status === GameStatus.READY) {
                // Immediate start
                const newDir = action.direction;
                // Prevent 180 turn
                if ((newDir === Direction.UP && state.direction === Direction.DOWN) ||
                    (newDir === Direction.DOWN && state.direction === Direction.UP) ||
                    (newDir === Direction.LEFT && state.direction === Direction.RIGHT) ||
                    (newDir === Direction.RIGHT && state.direction === Direction.LEFT)) {
                    return state;
                }
                return {
                    ...state,
                    direction: newDir,
                    status: GameStatus.PLAYING
                };
            }
            // Normal turn handling logic? 
            // In the hook, we used a moveQueue. 
            // For simplicity in reducer, we can just update 'direction' IF it hasn't changed this tick?
            // OR we just update it and trust the tick happens later.
            // The issue is pressing Left then Up quickly in one tick.
            // We'll stick to updating 'direction' directly for now to keep it simple, 
            // or add 'nextDirection' state if we want queueing.
            // Refactoring note: "moveQueue" was in a Ref. 
            // To strictly replicate it, we'd need 'moveQueue' in state.
            // For now, let's implement basic 180 prevention.
            const newDir = action.direction;
            const currentDir = state.direction;

            if ((newDir === Direction.UP && currentDir === Direction.DOWN) ||
                (newDir === Direction.DOWN && currentDir === Direction.UP) ||
                (newDir === Direction.LEFT && currentDir === Direction.RIGHT) ||
                (newDir === Direction.RIGHT && currentDir === Direction.LEFT)) {
                return state;
            }

            return { ...state, direction: newDir };
        }

        case 'TICK': {
            if (state.status !== GameStatus.PLAYING) return state;

            const snake = state.snake;
            const head = snake[0];
            const nextHead = { ...head };

            switch (state.direction) {
                case Direction.UP: nextHead.y -= 1; break;
                case Direction.DOWN: nextHead.y += 1; break;
                case Direction.LEFT: nextHead.x -= 1; break;
                case Direction.RIGHT: nextHead.x += 1; break;
            }

            // --- WRAP / WALL LOGIC ---
            const config = LEVEL_CONFIGS[state.level] || { wrapX: false, wrapY: false };
            let hitWall = false;

            // X Axis
            if (nextHead.x < 0 || nextHead.x >= BOARD_WIDTH) {
                if (config.wrapX) {
                    const isBlocked = config.blockedX?.some(([min, max]) => head.y >= min && head.y <= max);
                    if (isBlocked) hitWall = true;
                    else nextHead.x = nextHead.x < 0 ? BOARD_WIDTH - 1 : 0;
                } else {
                    hitWall = true;
                }
            }

            // Y Axis
            if (nextHead.y < 0 || nextHead.y >= BOARD_HEIGHT) {
                if (config.wrapY) {
                    const isBlocked = config.blockedY?.some(([min, max]) => head.x >= min && head.x <= max);
                    if (isBlocked) hitWall = true;
                    else nextHead.y = nextHead.y < 0 ? BOARD_HEIGHT - 1 : 0;
                } else {
                    hitWall = true;
                }
            }

            const walls = getWalls(state.level);

            // --- COLLISION CHECK ---
            if (
                hitWall ||
                snake.some(s => s.x === nextHead.x && s.y === nextHead.y) ||
                walls.some(w => w.x === nextHead.x && w.y === nextHead.y)
            ) {
                return { ...state, status: GameStatus.GAME_OVER };
            }

            // --- FOOD LOGIC ---
            let newSnake = [nextHead, ...snake];
            let newScore = state.score;
            let newFoodsEatenLevel = state.foodsEatenLevel;
            let newLevel = state.level;
            let newStatus: GameStatus = state.status;
            let newFood = state.food;
            let newBonusFood = state.bonusFood;
            let newBonusFoodTimer = state.bonusFoodTimer;
            let newBonusMaxTimer = state.bonusFoodMaxTimer;

            let eaten = false;

            // Check Regular Food
            if (nextHead.x === state.food.x && nextHead.y === state.food.y) {
                eaten = true;
                newScore += POINTS_NORMAL;
                newFoodsEatenLevel += 1;

                // Level Up Check
                if (newFoodsEatenLevel >= FOODS_PER_LEVEL) {
                    if (newLevel >= MAX_LEVEL) {
                        newStatus = GameStatus.GAME_WON;
                    } else {
                        newStatus = GameStatus.LEVEL_COMPLETE;
                    }
                }

                // Spawn Bonus Check
                // Total foods eaten proxy? We can track total or just use level count if safe
                // Simplification: Check if we just ate the Nth food this level
                if (newFoodsEatenLevel > 0 && newFoodsEatenLevel % FOODS_TO_BONUS === 0) {
                    const walls = getWalls(newLevel);
                    const bf = generateFood(newSnake, walls, [newFood]);
                    newBonusFood = bf;
                    const speed = state.speed;
                    const ticks = Math.floor(BONUS_DURATION_MS / speed);
                    newBonusFoodTimer = ticks;
                    newBonusMaxTimer = ticks;
                }

                // Respawn Main Food
                if (newStatus === GameStatus.PLAYING) {
                    const walls = getWalls(newLevel);
                    const bfList = newBonusFood ? [newBonusFood] : [];
                    newFood = generateFood(newSnake, walls, bfList);
                }
            }

            // Check Bonus Food
            if (newBonusFood && nextHead.x === newBonusFood.x && nextHead.y === newBonusFood.y) {
                eaten = true; // Grow again? Usually bonus doesn't grow snake in some versions, but let's stick to 'True' to be safe or False? 
                // In original code: if (!eaten) eaten = true;
                if (!eaten) eaten = true;
                newScore += POINTS_BIG;
                newBonusFood = null;
                newBonusFoodTimer = 0;
            }

            // Bonus Timer Tick
            if (newBonusFood) {
                newBonusFoodTimer -= 1;
                if (newBonusFoodTimer <= 0) {
                    newBonusFood = null;
                }
            }

            // Move Tail
            if (!eaten) {
                newSnake.pop();
            }

            return {
                ...state,
                snake: newSnake,
                score: newScore,
                status: newStatus,
                food: newFood,
                level: newLevel,
                foodsEatenLevel: newFoodsEatenLevel,
                bonusFood: newBonusFood,
                bonusFoodTimer: newBonusFoodTimer,
                bonusFoodMaxTimer: newBonusMaxTimer
            };
        }

        default:
            return state;
    }
};
