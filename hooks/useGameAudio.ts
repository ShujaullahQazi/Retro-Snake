import { useCallback } from 'react';
import { audioController } from '../utils/sound';

export type SoundType = 'move' | 'eat' | 'big_eat' | 'die' | 'level_up' | 'win' | 'big_appear' | 'big_miss';

export const useGameAudio = () => {
    const playSound = useCallback((soundName: SoundType) => {
        audioController.play(soundName);
    }, []);

    const resumeAudio = useCallback(() => {
        audioController.init();
    }, []);

    return { playSound, resumeAudio };
};
