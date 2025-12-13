import { useState, useEffect, useCallback, useRef } from 'react';
import { GameStatus, Direction, Point } from '../types';
import {
  BOARD_WIDTH, BOARD_HEIGHT, INITIAL_SNAKE, INITIAL_DIRECTION,
  INITIAL_SPEED,
  POINTS_NORMAL, POINTS_BIG, FOODS_TO_BONUS,
  BONUS_DURATION_MS, FOODS_PER_LEVEL, MAX_LEVEL, LEVEL_WALLS, LEVEL_CONFIGS
} from '../constants';
import { useGameLoop } from './useGameLoop';
import { useGameAudio } from './useGameAudio';

const getWalls = (level: number): Point[] => {
  return LEVEL_WALLS[level] || [];
};

const generateFood = (snake: Point[], walls: Point[], excludePoints: Point[] = []): Point => {
  let newFood: Point;
  let isInvalid = true;

  while (isInvalid) {
    newFood = {
      x: Math.floor(Math.random() * BOARD_WIDTH),
      y: Math.floor(Math.random() * BOARD_HEIGHT),
    };
    // eslint-disable-next-line no-loop-func
    const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    const onWall = walls.some(wall => wall.x === newFood.x && wall.y === newFood.y);
    const onExclude = excludePoints.some(p => p.x === newFood.x && p.y === newFood.y);

    isInvalid = onSnake || onWall || onExclude;
  }
  return newFood!;
};

export const useSnakeGame = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [bonusFood, setBonusFood] = useState<Point | null>(null);
  const [bonusFoodTimer, setBonusFoodTimer] = useState(0);
  const [bonusFoodMaxTimer, setBonusFoodMaxTimer] = useState(0);

  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const directionRef = useRef(INITIAL_DIRECTION);
  const moveQueueRef = useRef<Direction[]>([]);
  const snakeRef = useRef(INITIAL_SNAKE);
  const statusRef = useRef(GameStatus.IDLE);
  const foodRef = useRef(food);
  const bonusFoodRef = useRef(bonusFood);
  const foodsEatenRef = useRef(0);
  const totalFoodsEatenRef = useRef(0);
  const levelRef = useRef(1);
  const speedRef = useRef(INITIAL_SPEED);

  const { playSound, resumeAudio } = useGameAudio();

  useEffect(() => { directionRef.current = direction; }, [direction]);
  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { foodRef.current = food; }, [food]);
  useEffect(() => { bonusFoodRef.current = bonusFood; }, [bonusFood]);
  useEffect(() => { levelRef.current = level; }, [level]);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  useEffect(() => {
    const stored = localStorage.getItem('nokia-snake-highscore');
    if (stored) setHighScore(parseInt(stored, 10));
    setFood(generateFood(INITIAL_SNAKE, getWalls(1)));
  }, []);

  const startGame = useCallback(() => {
    resumeAudio();
    playLevel(1);
  }, [resumeAudio]);

  const playLevel = useCallback((targetLevel: number, customSpeed?: number) => {
    resumeAudio();
    setSnake(INITIAL_SNAKE);
    snakeRef.current = INITIAL_SNAKE;

    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    moveQueueRef.current = [];

    setScore(0);
    setLevel(targetLevel);
    levelRef.current = targetLevel;

    // Logic Simplified: Use provided speed or fallback to existing/default
    const newSpeed = customSpeed || speedRef.current || INITIAL_SPEED;
    setSpeed(newSpeed);
    speedRef.current = newSpeed;

    setStatus(GameStatus.READY);
    statusRef.current = GameStatus.READY;

    setBonusFood(null);
    setBonusFoodTimer(0);

    foodsEatenRef.current = 0;
    totalFoodsEatenRef.current = 0;

    setFood(generateFood(INITIAL_SNAKE, getWalls(targetLevel)));
  }, [resumeAudio]);

  const pauseGame = useCallback(() => {
    resumeAudio();
    const current = statusRef.current;

    if (current === GameStatus.PLAYING) {
      setStatus(GameStatus.PAUSED);
      statusRef.current = GameStatus.PAUSED;
    } else if (current === GameStatus.PAUSED) {
      setStatus(GameStatus.PLAYING);
      statusRef.current = GameStatus.PLAYING;
    }
  }, [resumeAudio]);

  useEffect(() => {
    const handlePause = () => {
      if (statusRef.current === GameStatus.PLAYING) {
        setStatus(GameStatus.PAUSED);
        statusRef.current = GameStatus.PAUSED;
      }
    };
    window.addEventListener('blur', handlePause);

    const handleVisibility = () => {
      if (document.hidden) handlePause();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('blur', handlePause);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const resetGame = useCallback(() => {
    setStatus(GameStatus.IDLE);
    statusRef.current = GameStatus.IDLE;
    setScore(0);
    setLevel(1);
    levelRef.current = 1;
    setSnake(INITIAL_SNAKE);
    snakeRef.current = INITIAL_SNAKE;
    setBonusFood(null);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    moveQueueRef.current = [];
  }, []);

  const startNextLevel = useCallback((startDirection: Direction) => {
    const newLevel = levelRef.current + 1;
    setLevel(newLevel);
    levelRef.current = newLevel;

    // Speed persists from previous level (no recalculation)

    setSnake(INITIAL_SNAKE);
    snakeRef.current = INITIAL_SNAKE;

    setDirection(startDirection);
    directionRef.current = startDirection;
    moveQueueRef.current = [];

    foodsEatenRef.current = 0;

    const walls = getWalls(newLevel);
    const bf = bonusFoodRef.current ? [bonusFoodRef.current] : [];
    setFood(generateFood(INITIAL_SNAKE, walls, bf));

    setStatus(GameStatus.READY);
    statusRef.current = GameStatus.READY;
  }, []);

  const toggleGame = useCallback(() => {
    resumeAudio();
    const s = statusRef.current;
    if (s === GameStatus.IDLE || s === GameStatus.GAME_OVER || s === GameStatus.GAME_WON) {
      startGame();
    } else if (s === GameStatus.PLAYING || s === GameStatus.PAUSED) {
      pauseGame();
    } else if (s === GameStatus.LEVEL_COMPLETE) {
      startNextLevel(Direction.UP);
    } else if (s === GameStatus.READY) {
      setStatus(GameStatus.PLAYING);
      statusRef.current = GameStatus.PLAYING;
      playSound('move');
    }
  }, [startGame, pauseGame, startNextLevel, playSound, resumeAudio]);

  const changeDirection = useCallback((newDir: Direction) => {
    resumeAudio();
    const currentStatus = statusRef.current;

    if (currentStatus === GameStatus.READY) {
      const currentDir = directionRef.current;
      if (newDir === Direction.UP && currentDir === Direction.DOWN) return;
      if (newDir === Direction.DOWN && currentDir === Direction.UP) return;
      if (newDir === Direction.LEFT && currentDir === Direction.RIGHT) return;
      if (newDir === Direction.RIGHT && currentDir === Direction.LEFT) return;

      setDirection(newDir);
      directionRef.current = newDir;
      moveQueueRef.current = [];

      setStatus(GameStatus.PLAYING);
      statusRef.current = GameStatus.PLAYING;
      playSound('move');
      return;
    }

    if (currentStatus === GameStatus.LEVEL_COMPLETE) {
      if (newDir === Direction.DOWN) return;
      startNextLevel(newDir);
      return;
    }

    const lastPlannedDir = moveQueueRef.current.length > 0
      ? moveQueueRef.current[moveQueueRef.current.length - 1]
      : directionRef.current;

    if (newDir === Direction.UP && lastPlannedDir === Direction.DOWN) return;
    if (newDir === Direction.DOWN && lastPlannedDir === Direction.UP) return;
    if (newDir === Direction.LEFT && lastPlannedDir === Direction.RIGHT) return;
    if (newDir === Direction.RIGHT && lastPlannedDir === Direction.LEFT) return;

    if (newDir !== lastPlannedDir && moveQueueRef.current.length < 2) {
      moveQueueRef.current.push(newDir);
    }
  }, [startNextLevel, playSound, resumeAudio]);

  const gameTick = useCallback(() => {
    // 1. Check Status
    if (statusRef.current !== GameStatus.PLAYING) return;

    // 2. Handle Direction Queue
    if (moveQueueRef.current.length > 0) {
      const nextDir = moveQueueRef.current.shift() as Direction;
      directionRef.current = nextDir;
      setDirection(nextDir);
    }

    // 3. Handle Bonus Timer
    if (bonusFoodRef.current) {
      setBonusFoodTimer(t => {
        if (t <= 1) {
          setBonusFood(null);
          playSound('big_miss');
          return 0;
        }
        return t - 1;
      });
    }

    // 4. Calculate Physics (Using Refs for stability)
    const snake = snakeRef.current; //
    const head = snake[0];
    const dir = directionRef.current;
    const nextHead = { ...head };

    switch (dir) {
      case Direction.UP: nextHead.y -= 1; break;
      case Direction.DOWN: nextHead.y += 1; break;
      case Direction.LEFT: nextHead.x -= 1; break;
      case Direction.RIGHT: nextHead.x += 1; break;
    }

    // Wrap / Wall Logic
    const config = LEVEL_CONFIGS[levelRef.current] || { wrapX: false, wrapY: false };
    let hitWall = false;

    // Check X Boundaries
    if (nextHead.x < 0 || nextHead.x >= BOARD_WIDTH) {
      if (config.wrapX) {
        const isBlocked = config.blockedX?.some(([min, max]) => head.y >= min && head.y <= max);
        if (isBlocked) hitWall = true;
        else nextHead.x = nextHead.x < 0 ? BOARD_WIDTH - 1 : 0;
      } else {
        hitWall = true;
      }
    }

    // Check Y Boundaries
    if (nextHead.y < 0 || nextHead.y >= BOARD_HEIGHT) {
      if (config.wrapY) {
        const isBlocked = config.blockedY?.some(([min, max]) => head.x >= min && head.x <= max);
        if (isBlocked) hitWall = true;
        else nextHead.y = nextHead.y < 0 ? BOARD_HEIGHT - 1 : 0;
      } else {
        hitWall = true;
      }
    }

    const walls = getWalls(levelRef.current);

    // 5. Collision Detection
    if (
      hitWall ||
      snake.some(s => s.x === nextHead.x && s.y === nextHead.y) ||
      walls.some(w => w.x === nextHead.x && w.y === nextHead.y)
    ) {
      setStatus(GameStatus.GAME_OVER);
      statusRef.current = GameStatus.GAME_OVER;
      playSound('die');
      return;
    }

    // 6. Food Logic
    const newSnake = [nextHead, ...snake];
    let eaten = false;

    // Check Regular Food
    if (nextHead.x === foodRef.current.x && nextHead.y === foodRef.current.y) {
      eaten = true;
      playSound('eat');
      setScore(s => s + POINTS_NORMAL); //
      foodsEatenRef.current += 1;
      totalFoodsEatenRef.current += 1;

      // Level Up Check
      if (foodsEatenRef.current >= FOODS_PER_LEVEL) {
        if (levelRef.current >= MAX_LEVEL) {
          setStatus(GameStatus.GAME_WON);
          statusRef.current = GameStatus.GAME_WON;
          playSound('win');
          setSnake(newSnake); // Update visuals before stopping
          return;
        } else {
          setStatus(GameStatus.LEVEL_COMPLETE);
          statusRef.current = GameStatus.LEVEL_COMPLETE;
          playSound('level_up');
          setSnake(newSnake); // Update visuals before stopping
          return;
        }
      }

      // Spawn Bonus
      if (totalFoodsEatenRef.current > 0 && totalFoodsEatenRef.current % FOODS_TO_BONUS === 0) {
        const bf = generateFood(newSnake, walls, [foodRef.current]);
        setBonusFood(bf);
        playSound('big_appear');
        // Calculate timer based on current speed
        const ticksFor3Sec = Math.floor(BONUS_DURATION_MS / speedRef.current);
        setBonusFoodTimer(ticksFor3Sec);
        setBonusFoodMaxTimer(ticksFor3Sec);
      }

      // Respawn Food
      const bf = bonusFoodRef.current ? [bonusFoodRef.current] : [];
      setFood(generateFood(newSnake, walls, bf));
    }

    // Check Bonus Food
    if (bonusFoodRef.current && nextHead.x === bonusFoodRef.current.x && nextHead.y === bonusFoodRef.current.y) {
      if (!eaten) eaten = true; // Grow if not already grown from normal food
      playSound('big_eat');
      setScore(s => s + POINTS_BIG); //
      setBonusFood(null);
      setBonusFoodTimer(0);
    }

    // 7. Move Snake
    if (!eaten) {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [playSound]);

  // Use the new custom hook for the game loop
  useGameLoop(gameTick, speed, status === GameStatus.PLAYING);

  useEffect(() => {
    if (status === GameStatus.GAME_OVER || status === GameStatus.GAME_WON) {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('nokia-snake-highscore', score.toString());
      }
    }
  }, [status, score, highScore]);

  return {
    snake,
    food,
    bonusFood,
    bonusFoodTimer,
    bonusFoodMaxTimer,
    direction,
    status,
    score,
    level,
    highScore,
    toggleGame,
    resetGame,
    playLevel,
    changeDirection
  };
};