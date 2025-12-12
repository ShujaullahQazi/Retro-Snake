import React from 'react';
import { COLORS, MAX_LEVEL } from '../constants';
import { Play, ChevronLeft, ChevronRight, Gauge, Layers } from 'lucide-react';

export type SpeedOption = 'SLOW' | 'Ic' | 'FAST';

interface MainMenuProps {
  level: number;
  setLevel: (level: number) => void;
  speed: SpeedOption;
  setSpeed: (speed: SpeedOption) => void;
  onStart: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ 
  level, 
  setLevel, 
  speed, 
  setSpeed, 
  onStart 
}) => {
  
  const toggleLevel = (dir: -1 | 1) => {
    setLevel(Math.max(1, Math.min(MAX_LEVEL, level + dir)));
  };

  const toggleSpeed = () => {
    const speeds: SpeedOption[] = ['SLOW', 'Ic', 'FAST'];
    const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
    setSpeed(speeds[nextIdx]);
  };

  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-center p-4 select-none relative"
      style={{ 
        backgroundColor: COLORS.SCREEN_BG,
        color: COLORS.SCREEN_PIXEL 
      }}
    >
      {/* Background Pattern (Scanlines) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(transparent 50%, rgba(0,0,0,0.5) 50%)', backgroundSize: '100% 4px' }} 
      />

      {/* Title */}
      <div className="mb-8 text-center animate-pulse z-10">
        <h1 className="text-4xl font-bold tracking-[0.2em] mb-1" style={{ textShadow: `2px 2px 0px ${COLORS.SCREEN_PIXEL_DIM}` }}>
          SNAKE
        </h1>
        <div className="text-[10px] tracking-widest opacity-80">NOKIA 3310 ED.</div>
      </div>

      {/* Menu Controls */}
      <div className="w-full max-w-[200px] flex flex-col gap-3 z-10 font-bold">
        
        {/* Level Selector */}
        <div className="flex items-center justify-between border-b-2 pb-1 border-current opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <Layers size={16} />
            <span className="text-sm tracking-wider">LEVEL</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => toggleLevel(-1)} className="p-1 hover:bg-black/5 rounded">
              <ChevronLeft size={16} />
            </button>
            <span className="w-4 text-center">{level}</span>
            <button onClick={() => toggleLevel(1)} className="p-1 hover:bg-black/5 rounded">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center justify-between border-b-2 pb-1 border-current opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <Gauge size={16} />
            <span className="text-sm tracking-wider">SPEED</span>
          </div>
          <button onClick={toggleSpeed} className="text-sm flex items-center gap-1 hover:bg-black/5 px-2 py-0.5 rounded uppercase">
             {speed === 'Ic' ? 'NORMAL' : speed}
          </button>
        </div>

        {/* Start Button */}
        <button 
          onClick={onStart}
          className="mt-4 w-full py-2 border-2 border-current flex items-center justify-center gap-2 hover:bg-black/10 active:translate-y-0.5 transition-all group"
          style={{ boxShadow: `4px 4px 0px ${COLORS.SCREEN_PIXEL_DIM}` }}
        >
          <Play size={18} className="fill-current group-hover:scale-110 transition-transform" />
          <span className="tracking-widest">START</span>
        </button>

      </div>

      <div className="absolute bottom-2 text-[10px] opacity-60">
        PRESS START
      </div>
    </div>
  );
};

export default MainMenu;