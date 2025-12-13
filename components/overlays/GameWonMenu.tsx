import React from 'react';
import { COLORS } from '../../constants';

interface GameWonMenuProps {
    score: number;
    onMenu: () => void;
}

const GameWonMenu: React.FC<GameWonMenuProps> = ({ score, onMenu }) => {
    return (
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
                onClick={onMenu}
                className="border-2 border-current px-6 py-1 hover:bg-black/10 active:translate-y-0.5"
            >
                MENU
            </button>
        </div>
    );
};

export default GameWonMenu;
