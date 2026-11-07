// Web Audio API Synthesizer for game sounds
class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play pleasant click / tap
  playTap() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // ignore
    }
  }

  // Play victory / correct answer chime
  playSuccess() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = this.ctx!.currentTime + idx * 0.07;
        const duration = 0.25;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch {
      // ignore
    }
  }

  // Play wrong buzzer
  playError() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(196, this.ctx.currentTime);
      osc.frequency.setValueAtTime(146.83, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.32);
    } catch {
      // ignore
    }
  }

  // Camera scan / radar pulse sound
  playScan() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.26);
    } catch {
      // ignore
    }
  }

  // Level Up / Celebration fanfare
  playFanfare() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const chords = [
        { freqs: [440, 554.37, 659.25], time: 0, dur: 0.15 },
        { freqs: [440, 554.37, 659.25], time: 0.16, dur: 0.15 },
        { freqs: [440, 554.37, 659.25], time: 0.32, dur: 0.15 },
        { freqs: [587.33, 739.99, 880], time: 0.5, dur: 0.5 }
      ];

      chords.forEach(c => {
        c.freqs.forEach(f => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          const start = this.ctx!.currentTime + c.time;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, start);

          gain.gain.setValueAtTime(0.08, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + c.dur);

          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(start);
          osc.stop(start + c.dur);
        });
      });
    } catch {
      // ignore
    }
  }
}

export const sound = new SoundEffects();
