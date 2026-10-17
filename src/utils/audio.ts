// Synthetic mechanical click sounds using Web Audio API

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playKeyClick(isSpace = false, isError = false, volume = 0.25): void {
  if (volume <= 0) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    if (isError) {
      // Dull soft error thud
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.08);

      gainNode.gain.setValueAtTime(volume * 0.4, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } else if (isSpace) {
      // Deeper tactile thud for spacebar
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.06);

      gainNode.gain.setValueAtTime(volume * 0.35, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } else {
      // Crisp mechanical tactile click
      // Pitch randomized slightly to sound natural
      const baseFreq = 750 + Math.random() * 120;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.035);

      gainNode.gain.setValueAtTime(volume * 0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    }
  } catch {
    // Graceful silence if audio policy blocks
  }
}
