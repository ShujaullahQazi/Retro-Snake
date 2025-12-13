import React from 'react';
import { Pause } from 'lucide-react';
import { COLORS } from '../../constants';

interface PauseMenuProps {
    onResume: () => void;
    onQuit: () => void;
}

const PauseMenu: React.FC<PauseMenuProps> = ({ onResume, onQuit }) => {
    return (
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
                    onClick={onResume}
                    className="w-full border-2 border-current py-1 hover:bg-black/10 active:translate-y-0.5 bg-white/50"
                >
                    RESUME
                </button>
                <button
                    onClick={onQuit}
                    className="w-full border-2 border-current py-1 hover:bg-black/10 active:translate-y-0.5 bg-white/50"
                >
                    QUIT
                </button>
            </div>
        </div>
    );
};

export default PauseMenu;
