/**
 * Web Audio API Audio Synthesizer for Real-Time Arrival Alerts
 * Synthesizes an elegant dual-tone chime without external audio files.
 */
class AudioManager {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }

    return this.audioCtx;
  }

  /**
   * Proactively unlock audio context on initial user interaction (click, keypress, touch)
   */
  public initAutoplayUnlock(): void {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };

    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });
  }

  /**
   * Plays a distinct arrival chime:
   * Tone 1: 587.33 Hz (D5) -> Tone 2: 880.00 Hz (A5)
   */
  public playNewOrderChime(): void {
    if (this.isMuted) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Master gain node
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.3, now + 0.02);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      masterGain.connect(ctx.destination);

      // Note 1: D5 (587.33 Hz)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      osc1.frequency.exponentialRampToValueAtTime(880.0, now + 0.15); // Glides to A5
      osc1.connect(masterGain);

      // Note 2: Harmonic overtone for chime brightness (E6 1318.5 Hz)
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1174.66, now + 0.1);
      osc2.connect(masterGain);

      osc1.start(now);
      osc1.stop(now + 0.5);

      osc2.start(now + 0.1);
      osc2.stop(now + 0.5);
    } catch (err) {
      console.warn('[Audio Alert] Could not play synthesized chime:', err);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMutedState(): boolean {
    return this.isMuted;
  }
}

export const audioAlert = new AudioManager();
