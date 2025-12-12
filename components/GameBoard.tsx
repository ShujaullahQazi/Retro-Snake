import React, { useMemo } from 'react';
import { Point } from '../types';
import { BOARD_WIDTH, BOARD_HEIGHT, COLORS, LEVEL_WALLS } from '../constants';

interface GameBoardProps {
  snake: Point[];
  food: Point;
  bonusFood: Point | null;
  bonusFoodTimer: number;
  bonusFoodMaxTimer: number;
  level: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ snake, food, bonusFood, bonusFoodTimer, bonusFoodMaxTimer, level }) => {
  const walls = LEVEL_WALLS[level] || [];

  // Optimization: Create Sets for O(1) lookup
  // Snake updates every tick, but Set construction is O(N) vs O(N*BoardSize) for nested .some() calls
  const snakeSet = useMemo(() => {
    return new Set(snake.map(s => `${s.x},${s.y}`));
  }, [snake]);

  // Walls only update on level change, so this is a significant perf win
  const wallSet = useMemo(() => {
    return new Set(walls.map(w => `${w.x},${w.y}`));
  }, [walls]);

  const cells = [];
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const coord = `${x},${y}`;
      
      // O(1) Lookups
      const isSnake = snakeSet.has(coord);
      const isWall = wallSet.has(coord);
      
      const isHead = snake.length > 0 && snake[0].x === x && snake[0].y === y;
      const isFood = food.x === x && food.y === y;
      const isBonus = bonusFood && bonusFood.x === x && bonusFood.y === y;

      let cellContent = null;
      
      if (isSnake) {
          cellContent = (
            <div 
                className={`w-full h-full pixel-shadow`}
                style={{ 
                    backgroundColor: isHead ? `${COLORS.SCREEN_PIXEL}e6` : COLORS.SCREEN_PIXEL 
                }}
            >
                 {isHead && (
                    <div 
                        className="w-[30%] h-[30%] mx-auto mt-[10%] opacity-60 rounded-full"
                        style={{ backgroundColor: COLORS.SCREEN_BG }}
                    />
                 )}
            </div>
          );
      } else if (isWall) {
          cellContent = (
             <div 
                className="w-full h-full border pixel-shadow relative"
                style={{ 
                    backgroundColor: COLORS.SCREEN_PIXEL,
                    borderColor: COLORS.SCREEN_BG
                }}
             >
                {/* Cross pattern for walls */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                        className="w-[80%] h-[80%] border opacity-20"
                        style={{ borderColor: COLORS.SCREEN_BG }}
                    ></div>
                </div>
             </div>
          );
      } else if (isBonus) {
          cellContent = (
             <div className="w-full h-full flex items-center justify-center">
                 <div 
                    className="w-[120%] h-[120%] rounded-full animate-pulse z-10 border-4"
                    style={{ 
                        backgroundColor: COLORS.SCREEN_PIXEL,
                        borderColor: COLORS.SCREEN_BG
                    }}
                 ></div>
             </div>
          );
      } else if (isFood) {
          cellContent = (
            <div className="w-full h-full flex items-center justify-center">
               <div 
                    className="w-[60%] h-[60%] rounded-sm"
                    style={{ backgroundColor: COLORS.SCREEN_PIXEL }}
               ></div>
            </div>
          );
      }

      cells.push(
        <div
          key={`${x}-${y}`}
          className="w-full h-full border-[0.5px] relative"
          style={{ borderColor: COLORS.SCREEN_PIXEL_DIM }}
        >
            {cellContent}
        </div>
      );
    }
  }

  // Calculate Bonus Timer Bar width
  const bonusProgress = bonusFood && bonusFoodMaxTimer > 0 
    ? (bonusFoodTimer / bonusFoodMaxTimer) * 100 
    : 0;

  return (
    <div className="relative w-full h-full">
        {/* Receding Bonus Bar */}
        {bonusFood && (
            <div 
                className="absolute top-0 left-0 w-full h-1 z-20 opacity-50"
                style={{ backgroundColor: COLORS.SCREEN_BG }}
            >
                <div 
                    className="h-full transition-all duration-100 ease-linear"
                    style={{ 
                        width: `${bonusProgress}%`,
                        backgroundColor: COLORS.SCREEN_PIXEL
                    }}
                ></div>
            </div>
        )}

        <div 
        className="grid w-full h-full relative lcd-screen border-4"
        style={{
            gridTemplateColumns: `repeat(${BOARD_WIDTH}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${BOARD_HEIGHT}, minmax(0, 1fr))`,
            backgroundColor: COLORS.SCREEN_BG,
            borderColor: COLORS.SCREEN_PIXEL
        }}
        >
        {cells}
        </div>
    </div>
  );
};

export default GameBoard;