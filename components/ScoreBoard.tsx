import React from 'react';
import { COLORS } from '../constants';

interface ScoreBoardProps {
    score: number;
    level: number;
    highScore: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, level, highScore }) => {
    return (
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
    );
};

export default ScoreBoard;
