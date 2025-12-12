import React, { useEffect, useState } from 'react';
import { useSnakeGame } from './hooks/useSnakeGame';
import { useGlobalSwipe } from './hooks/useGlobalSwipe';
import GameScreen from './components/GameScreen';
import MainMenu from './components/MainMenu';
import { Direction, GameStatus, SpeedOption } from './types';
import { COLORS, INITIAL_SPEED } from './constants';

const App: React.FC = () => {
  const [screen, setScreen] = useState<'MENU' | 'GAME'>('MENU');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [selectedSpeed, setSelectedSpeed] = useState<SpeedOption>('NORMAL');

  const {
    snake,
    food,
    bonusFood,
    bonusFoodTimer,
    bonusFoodMaxTimer,
    status,
    score,
    level,
    highScore,
    toggleGame,
    resetGame,
    playLevel,
    changeDirection
  } = useSnakeGame();

  useGlobalSwipe(changeDirection);

  useEffect(() => {
    if (status === GameStatus.IDLE) {
      setScreen('MENU');
    }
  }, [status]);

  const handleStartGame = () => {
    const baseSpeed = INITIAL_SPEED; 
    let finalSpeed = baseSpeed;

    if (selectedSpeed === 'SLOW') finalSpeed = Math.floor(baseSpeed * 1.5);
    if (selectedSpeed === 'FAST') finalSpeed = Math.floor(baseSpeed * 0.7);

    setScreen('GAME');
    playLevel(selectedLevel, finalSpeed);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (screen === 'MENU') {
        if (e.key === 'Enter') handleStartGame();
        return;
      }

      switch (e.key) {
        case 'ArrowUp': changeDirection(Direction.UP); break;
        case 'ArrowDown': changeDirection(Direction.DOWN); break;
        case 'ArrowLeft': changeDirection(Direction.LEFT); break;
        case 'ArrowRight': changeDirection(Direction.RIGHT); break;
        case 'Enter': toggleGame(); break;
        case 'Escape': resetGame(); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, changeDirection, toggleGame, resetGame, selectedLevel, selectedSpeed]); 

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-800 font-mono">
      {/* Device Container */}
      <div 
        className="p-6 rounded-3xl border-b-8 border-r-8 w-fit relative flex flex-col items-center"
        style={{ 
            backgroundColor: COLORS.CASE_BODY,
            borderColor: COLORS.CASE_SHADOW,
            boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 2px 5px rgba(255,255,255,0.1)'
        }}
      >
        
        {/* Branding */}
        <div className="text-[#888] text-[10px] tracking-[0.4em] font-bold opacity-60 uppercase mb-3 w-full text-center">
            Handheld Entertainment System
        </div>

        {/* Screen Housing */}
        <div 
            className="p-3 rounded-lg shadow-inner border-2 mb-6"
            style={{
                backgroundColor: COLORS.CASE_ACCENT,
                borderColor: COLORS.CASE_BORDER
            }}
        >
            <div 
                //
                className="rounded overflow-hidden opacity-90 w-80 relative"
                style={{ 
                    backgroundColor: COLORS.SCREEN_BG_DIM,
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)'
                }}
            >
                {screen === 'MENU' ? (
                  <MainMenu 
                    level={selectedLevel}
                    setLevel={setSelectedLevel}
                    speed={selectedSpeed}
                    setSpeed={setSelectedSpeed}
                    onStart={handleStartGame}
                  />
                ) : (
                  <GameScreen 
                    snake={snake}
                    food={food}
                    bonusFood={bonusFood}
                    bonusFoodTimer={bonusFoodTimer}
                    bonusFoodMaxTimer={bonusFoodMaxTimer}
                    status={status}
                    score={score}
                    level={level}
                    highScore={highScore}
                    toggleGame={toggleGame}
                    changeDirection={changeDirection}
                  />
                )}
            </div>

            <div className="flex justify-between items-center mt-2 px-1">
                <span className="text-gray-500 text-[10px]">
                  {screen === 'GAME' ? 'TAP SCREEN TO PAUSE' : 'SELECT OPTIONS'}
                </span>
                <div 
                    className={`w-1.5 h-1.5 rounded-full ${status !== GameStatus.IDLE && screen === 'GAME' ? 'animate-pulse shadow-[0_0_5px_red]' : ''}`}
                    style={{ backgroundColor: status === GameStatus.IDLE ? COLORS.LED_RED_OFF : COLORS.LED_RED_ON }}
                ></div>
            </div>
        </div>

        {/* */}

      </div>
      <style>{`
        .blink-slow {
            animation: blinker 1.5s linear infinite;
        }
        @keyframes blinker {
            50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default App;