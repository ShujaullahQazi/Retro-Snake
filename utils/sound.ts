// Simple oscillator based sound engine - Nokia Style
let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Export explicit resume for user interactions
export const resumeAudio = () => {
    initAudio();
};

export const playSound = (type: 'move' | 'eat' | 'big_eat' | 'die' | 'level_up' | 'win' | 'big_appear' | 'big_miss') => {
  const ctx = initAudio();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  const now = ctx.currentTime;
  
  // Nokia sounds were mostly square waves, very simple "bip" sounds.
  osc.type = 'square';

  switch (type) {
    case 'move':
      // Very faint tick
      osc.frequency.setValueAtTime(100, now);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.01);
      osc.start(now);
      osc.stop(now + 0.01);
      break;
    case 'eat':
      // Classic high pitched 'bip'
      osc.frequency.setValueAtTime(2000, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
      break;
    case 'big_appear':
      // Alert sound! High-Low-High
      osc.frequency.setValueAtTime(1500, now);
      osc.frequency.setValueAtTime(1000, now + 0.1);
      osc.frequency.setValueAtTime(1500, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
    case 'big_miss':
      // Disappointing descending slide
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.linearRampToValueAtTime(300, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
      break;
    case 'big_eat':
      // A double bip
      osc.frequency.setValueAtTime(2500, now);
      gain.gain.setValueAtTime(0.1, now);
      osc.start(now);
      osc.stop(now + 0.1);
      
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'square';
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      
      osc2.frequency.setValueAtTime(3000, now + 0.1);
      gain2.gain.setValueAtTime(0.1, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.2);
      break;
    case 'level_up':
       // Rising arpeggio
       osc.type = 'square';
       osc.frequency.setValueAtTime(1000, now);
       osc.frequency.setValueAtTime(1500, now + 0.1);
       osc.frequency.setValueAtTime(2000, now + 0.2);
       gain.gain.setValueAtTime(0.1, now);
       gain.gain.linearRampToValueAtTime(0, now + 0.3);
       osc.start(now);
       osc.stop(now + 0.3);
       break;
    case 'die':
      // Low pitched 'bonk'
      osc.type = 'sawtooth'; 
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(50, now + 0.3);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
    case 'win':
      // Victory melody
      const melody = [523.25, 659.25, 783.99, 1046.50]; // C E G C
      let time = now;
      melody.forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'square';
          o.connect(g);
          g.connect(ctx.destination);
          o.frequency.value = freq;
          g.gain.setValueAtTime(0.1, time);
          g.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
          o.start(time);
          o.stop(time + 0.15);
          time += 0.15;
      });
      break;
  }
};