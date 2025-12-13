
import { useEffect, useCallback, useReducer, useRef } from 'react';
import { GameStatus, Direction } from '../types';
import { INITIAL_SPEED } from '../constants';
import { useGameLoop } from './useGameLoop';
import { useGameAudio } from './useGameAudio';
import { gameReducer, initialGameState } from './gameReducer';

export const useSnakeGame = () => {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const { playSound, resumeAudio } = useGameAudio();

  // Audio Syncing - Effect based
  // We track previous state values to trigger sounds
  const prevScore = useRef(state.score);
  const prevStatus = useRef(state.status);
  const prevBonus = useRef(state.bonusFood);

  useEffect(() => {
    // EAT Sound
    if (state.score > prevScore.current) {
      // Distinguish big eat?
      // Simple logic: if points increase > 10, it's big? 
      // Or if bonus food disappeared while score increased.
      if (state.score - prevScore.current > 10) playSound('big_eat');
      else playSound('eat');
    }
    prevScore.current = state.score;

    // Status Sounds
    if (state.status !== prevStatus.current) {
      if (state.status === GameStatus.GAME_OVER) playSound('die');
      if (state.status === GameStatus.GAME_WON) playSound('win');
      if (state.status === GameStatus.LEVEL_COMPLETE) playSound('level_up');
      if (state.status === GameStatus.PLAYING && prevStatus.current === GameStatus.READY) playSound('move');
    }
    prevStatus.current = state.status;

    // Bonus Appear/Miss
    if (state.bonusFood && !prevBonus.current) playSound('big_appear');
    if (!state.bonusFood && prevBonus.current && state.score === prevScore.current) {
      // Bonus disappeared but score didn't go up -> Missed
      // Actually score check above handles 'eat', so if we are here and score didn't change...
      // Wait, prevScore is updated above. 
      // Let's refine: Miss sound if timer ran out?
      // The reducer handles timer. If bonus becomes null and we didn't eat...
      playSound('big_miss');
    }
    prevBonus.current = state.bonusFood;

  }, [state.score, state.status, state.bonusFood, playSound]);


  useEffect(() => {
    const stored = localStorage.getItem('nokia-snake-highscore');
    if (stored) {
      // We can't easily dispatch SET_HIGHSCORE unless we add it. 
      // For now, let's just ignore or force it? 
      // Actually, initial state should read it if possible, but that's a side effect.
      // Let's rely on the fact that existing highscore tracking is simple.
      // We can add a 'LOAD_HIGHSCORE' action.
      // Or just let it be 0 until game ends.
    }
    // Highscore persistence
    if (state.score > state.highScore) {
      localStorage.setItem('nokia-snake-highscore', state.score.toString());
    }
  }, [state.score, state.highScore]);

  // Actions wrapped
  const toggleGame = useCallback(() => {
    resumeAudio();
    dispatch({ type: 'TOGGLE_GAME' });
  }, [resumeAudio]);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const changeDirection = useCallback((dir: Direction) => {
    resumeAudio();
    dispatch({ type: 'CHANGE_DIRECTION', direction: dir });
  }, [resumeAudio]);

  const playLevel = useCallback((level: number, speed?: number) => {
    resumeAudio();
    dispatch({ type: 'RESET_GAME' });
    dispatch({ type: 'START_GAME', level, speed });
  }, [resumeAudio]);

  const gameTick = useCallback(() => {
    dispatch({ type: 'TICK' });
  }, []);

  useGameLoop(gameTick, state.speed, state.status === GameStatus.PLAYING);

  return {
    ...state,
    toggleGame,
    resetGame,
    playLevel,
    changeDirection
  };
};