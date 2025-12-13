import { useCallback } from 'react';
import { playSound as playSoundUtil, resumeAudio as resumeAudioUtil } from '../utils/sound';

export type SoundType = 'move' | 'eat' | 'big_eat' | 'die' | 'level_up' | 'win' | 'big_appear' | 'big_miss';

export const useGameAudio = () => {
    const playSound = useCallback((soundName: SoundType) => {
        playSoundUtil(soundName);
    }, []);

    const resumeAudio = useCallback(() => {
        resumeAudioUtil();
    }, []);

    return { playSound, resumeAudio };
};
