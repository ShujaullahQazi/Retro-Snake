import React from 'react';
import { COLORS } from '../../constants';

interface GameOverMenuProps {
    score: number;
    level: number;
    onMenu: () => void;
}

const GameOverMenu: React.FC<GameOverMenuProps> = ({ score, level, onMenu }) => {
    return (
        <div
            className="absolute inset-0 flex flex-col items-center justify-center font-bold z-10"
            style={{ backgroundColor: `${COLORS.SCREEN_PIXEL}e6`, color: COLORS.SCREEN_BG }}
            onClick={(e) => e.stopPropagation()}
        >
            <span className="text-3xl mb-2 tracking-widest">GAME OVER</span>
            <div className="flex flex-col items-center text-lg gap-1 mb-4">
                <span>SCORE: {score}</span>
                <span>LEVEL: {level}</span>
            </div>

            <div className="flex flex-col gap-2 w-3/4">
                <button
                    onClick={onMenu}
                    className="border-2 border-current py-1 hover:bg-white/20 active:translate-y-0.5"
                >
                    MENU
                </button>
            </div>
        </div>
    );
};

export default GameOverMenu;
