import React, { useRef } from 'react';
import { Pause } from 'lucide-react';
import GameBoard from './GameBoard';
import { Direction, GameStatus, Point } from '../types';
import { COLORS, SWIPE_THRESHOLD } from '../constants';
import ScoreBoard from './ScoreBoard';
import GameOverMenu from './overlays/GameOverMenu';
import PauseMenu from './overlays/PauseMenu';
import GameWonMenu from './overlays/GameWonMenu';

interface GameScreenProps {
    score: number;
    level: number;
    highScore: number;
    status: GameStatus;
    snake: Point[];
    food: Point;
    bonusFood: Point | null;
    bonusFoodTimer: number;
    bonusFoodMaxTimer: number;
    toggleGame: () => void;
    resetGame: () => void;
    changeDirection: (dir: Direction) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({
    score,
    level,
    highScore,
    status,
    snake,
    food,
    bonusFood,
    bonusFoodTimer,
    bonusFoodMaxTimer,
    toggleGame,
    resetGame,
    changeDirection
}) => {

    // New Helper: Explicit Quit
    // We need to access resetGame from useSnakeGame, but GameScreen only gets toggleGame.
    // We can treat toggleGame as 'Action' and use props to pass a quitting function if needed.
    // However, looking at App.tsx: GameScreen doesn't receive resetGame.
    // We'll trust toggleGame does the right thing based on status (as fixed in previous step), 
    // OR we need to update GameScreenProps to accept resetGame.

    // Let's rely on the previous fix where toggleGame() on GAME_OVER calls resetGame().
    // For PAUSE, we need a way to QUIT. toggleGame() just unpauses.
    // We need to update App.tsx and GameScreenProps to pass `resetGame`.

    return (
        <div
            className="relative shadow-inner cursor-pointer"
            onClick={() => toggleGame()}
        >
            {/* Header Bar */}
            <ScoreBoard score={score} level={level} highScore={highScore} />

            {/* Game Area */}
            <div className="h-64 w-full md:w-80 md:h-64 relative">
                <GameBoard
                    snake={snake}
                    food={food}
                    bonusFood={bonusFood}
                    bonusFoodTimer={bonusFoodTimer}
                    bonusFoodMaxTimer={bonusFoodMaxTimer}
                    level={level}
                />

                {/* Ready Overlay */}
                {status === GameStatus.READY && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <span
                            className="text-xl font-bold blink-slow px-2 border"
                            style={{
                                backgroundColor: `${COLORS.SCREEN_BG}cc`,
                                borderColor: COLORS.SCREEN_PIXEL,
                                color: COLORS.SCREEN_PIXEL
                            }}
                        >
                            PRESS ARROW
                        </span>
                    </div>
                )}
            </div>

            {/* IDLE State */}
            {status === GameStatus.IDLE && (
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center font-bold z-10"
                    style={{ backgroundColor: `${COLORS.SCREEN_BG}e6`, color: COLORS.SCREEN_PIXEL }}
                >
                    <div
                        className="border-4 p-2 mb-2 shadow-[4px_4px_0px]"
                        style={{
                            borderColor: COLORS.SCREEN_PIXEL,
                            backgroundColor: COLORS.SCREEN_BG,
                            color: COLORS.SCREEN_PIXEL,
                            boxShadow: `4px 4px 0px ${COLORS.SCREEN_PIXEL}`
                        }}
                    >
                        <div className="w-8 h-8 mx-auto animate-bounce rounded-sm" style={{ backgroundColor: COLORS.SCREEN_PIXEL }}></div>
                    </div>
                    <span className="text-3xl tracking-widest animate-pulse mb-1">SNAKE</span>
                    <span className="text-sm blinking-text">SELECT LEVEL</span>
                </div>
            )}

            {/* GAME OVER State */}
            {status === GameStatus.GAME_OVER && (
                <GameOverMenu score={score} level={level} onMenu={resetGame} />
            )}

            {/* LEVEL COMPLETE State */}
            {status === GameStatus.LEVEL_COMPLETE && (
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center font-bold z-10"
                    style={{ backgroundColor: `${COLORS.SCREEN_BG}e6`, color: COLORS.SCREEN_PIXEL }}
                >
                    <span className="text-xl mb-2 tracking-widest border-b-2" style={{ borderColor: COLORS.SCREEN_PIXEL }}>LEVEL {level} DONE</span>
                    <span className="text-lg animate-pulse mb-4">READY?</span>
                    <span className="text-sm blinking-text px-4 text-center">TAP SCREEN TO CONTINUE</span>
                </div>
            )}

            {/* GAME WON State */}
            {status === GameStatus.GAME_WON && (
                <GameWonMenu score={score} onMenu={resetGame} />
            )}

            {/* PAUSED State */}
            {status === GameStatus.PAUSED && (
                <PauseMenu onResume={toggleGame} onQuit={resetGame} />
            )}
        </div>
    );
};

export default GameScreen;