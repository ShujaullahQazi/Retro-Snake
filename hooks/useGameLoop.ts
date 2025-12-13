import { useEffect, useRef } from 'react';

export const useGameLoop = (callback: () => void, delay: number, isRunning: boolean) => {
    const savedCallback = useRef(callback);

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        if (!isRunning) return;

        const tick = () => {
            savedCallback.current();
        };

        const id = setInterval(tick, delay);
        return () => clearInterval(id);
    }, [delay, isRunning]);
};
