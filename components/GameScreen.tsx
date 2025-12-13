import React, { useRef } from 'react';
import { Pause } from 'lucide-react';
import GameBoard from './GameBoard';
import { Direction, GameStatus, Point } from '../types';
import { COLORS, SWIPE_THRESHOLD } from '../constants';

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
            <div
                className="flex justify-between items-center px-3 py-2 text-lg font-bold border-b-4 tracking-wider select-none"
                style={{
                    backgroundColor: COLORS.SCREEN_BG,
                    color: COLORS.SCREEN_PIXEL,
                    borderColor: COLORS.SCREEN_PIXEL
                }}
            >
                <div className="flex gap-4"><span>SC:{score}</span><span>LVL:{level}</span></div>
                <span>HI:{highScore}</span>
            </div>

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
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center font-bold z-10"
                    style={{ backgroundColor: `${COLORS.SCREEN_PIXEL}e6`, color: COLORS.SCREEN_BG }}
                    onClick={(e) => e.stopPropagation()} // Prevent background click from auto-restarting
                >
                    <span className="text-3xl mb-2 tracking-widest">GAME OVER</span>
                    <div className="flex flex-col items-center text-lg gap-1 mb-4">
                        <span>SCORE: {score}</span>
                        <span>LEVEL: {level}</span>
                    </div>

                    <div className="flex flex-col gap-2 w-3/4">
                        <button
                            onClick={() => toggleGame()} // Maps to resetGame -> Menu
                            className="border-2 border-current py-1 hover:bg-white/20 active:translate-y-0.5"
                        >
                            MENU
                        </button>
                    </div>
                </div>
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
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center font-bold z-10 animate-in fade-in duration-500"
                    style={{ backgroundColor: COLORS.SCREEN_BG, color: COLORS.SCREEN_PIXEL }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div
                        className="border-4 p-4 mb-4"
                        style={{
                            borderColor: COLORS.SCREEN_PIXEL,
                            boxShadow: `8px 8px 0px ${COLORS.SCREEN_PIXEL}`
                        }}
                    >
                        <span className="text-3xl tracking-widest block text-center mb-2">MISSION</span>
                        <span className="text-3xl tracking-widest block text-center">COMPLETE</span>
                    </div>
                    <div className="flex flex-col items-center text-xl gap-2 mb-6">
                        <span className="animate-pulse">YOU WON!</span>
                        <span>FINAL SCORE: {score}</span>
                    </div>
                    <button
                        onClick={() => toggleGame()} // Maps to resetGame -> Menu
                        className="border-2 border-current px-6 py-1 hover:bg-black/10 active:translate-y-0.5"
                    >
                        MENU
                    </button>
                </div>
            )}

            {/* PAUSED State */}
            {status === GameStatus.PAUSED && (
                <div
                    className="absolute inset-0 flex items-center justify-center font-bold z-10"
                    style={{ backgroundColor: `${COLORS.SCREEN_BG}b3`, color: COLORS.SCREEN_PIXEL }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-col items-center gap-2 w-full max-w-[200px]">
                        <Pause size={40} fill={COLORS.SCREEN_PIXEL} color={COLORS.SCREEN_PIXEL} />
                        <span
                            className="text-2xl border-4 px-2 mb-2"
                            style={{
                                borderColor: COLORS.SCREEN_PIXEL,
                                backgroundColor: COLORS.SCREEN_BG,
                                boxShadow: `4px 4px 0px ${COLORS.SCREEN_PIXEL}`
                            }}
                        >PAUSED</span>

                        <button
                            onClick={() => toggleGame()} // RESUME
                            className="w-full border-2 border-current py-1 hover:bg-black/10 active:translate-y-0.5 bg-white/50"
                        >
                            RESUME
                        </button>
                        <button
                            onClick={() => resetGame()} // QUIT
                            className="w-full border-2 border-current py-1 hover:bg-black/10 active:translate-y-0.5 bg-white/50"
                        >
                            QUIT
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameScreen;